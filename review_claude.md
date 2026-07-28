# Аудит проекта RMC (Next.js) — что переписать и как построить архитектуру

Прошёлся по всему репозиторию. Ниже — сгруппированные находки: сначала критичные баги/безопасность, потом дублирование и архитектура, потом конкретный план действий с целевой структурой.

---

## 1. Критичные проблемы (исправить в первую очередь)

### 1.1 Перепутанные файлы метаданных — реальный баг, не просто стиль

```
lib/configs/config-meta/nomenclatures/generateNomenclatureMetadata.ts
  → экспортирует generateNomenclatureStructuredData()  (JSON-LD)

lib/configs/config-meta/nomenclatures/generateNomenclatureStructuredData.ts
  → экспортирует generateNomenclatureMetadata() и generateNotFoundMetadata()  (Next Metadata)
```

Имена файлов и то, что они реально экспортируют, зеркально перепутаны. `index.ts` реэкспортирует это ещё раз, усиливая путаницу. Любой новый разработчик потратит время, чтобы понять, где что лежит. **Переименовать файлы по факту содержимого**, оставить один явный неймспейс: `metadata.ts` (Metadata API) и `structuredData.ts` (JSON-LD).

### 1.2 Шифрование в `lib/crypto.ts`

- AES-256-**CBC** без HMAC/AEAD — уязвимо к padding-oracle атакам.
- IV читается один раз из `env` и переиспользуется для **всех** сообщений — для CBC это критично: одинаковый plaintext даёт одинаковый ciphertext, паттерны утекают.
- Рекомендация: перейти на `aes-256-gcm` со случайным IV на каждое сообщение (IV хранить вместе с ciphertext, не в env).

### 1.3 `SESSION_SECRET` / пароли сессии с дефолтным fallback

```ts
password: process.env.SESSION_SECRET ||
  'complex_password_at_least_32_characters'
```

Такой fallback встречается в `lib/session.ts`, `httpServer.ts`, `app/api/files/list/route.ts`. Если переменная окружения не задана в проде — все сессии подписываются публично известной строкой из репозитория. **Нужно кидать ошибку на старте**, если secret не задан, а не тихо подставлять дефолт.

### 1.4 Ручной decode JWT без проверки подписи

`lib/getServerSessionFromHeaders.ts` декодирует payload через `Buffer.from(payload, 'base64')` без проверки signature. Если где-то на основе этого принимаются решения об авторизации — это подделываемый токен. Нужно либо не использовать эту функцию для авторизационных решений, либо верифицировать подпись (`jose`/`jsonwebtoken`).

### 1.5 Две параллельные auth-системы одновременно

- JWT `access_token` cookie (проверяется через `auth/jwt/verify/`)
- `iron-session` (`1c_auth_session`) с `xrmcCookie` внутри

Оба механизма используются вперемешку в `httpServer.ts`, `middleware.ts`, `session.ts`. Непонятно, какой является источником истины, из-за этого получается ветвистая логика получения токена (`getAuthData` пробует 5+ источников подряд). **Выбрать один механизм** (скорее всего JWT-cookie, раз iron-session закомментирован в `middleware.ts`), второй — выпилить.

### 1.6 Логирование токенов/куки в консоль

`httpClient.ts`: `console.log('token client', token)`, `httpServer.ts`: логирует наличие Authorization/Cookie (частично замаскировано, но местами `console.log('Auth data:', ...)` печатает сырые значения через объект). В проде это либо попадёт в логи хостинга, либо просто мусор. Нужно:

- убрать все `console.log` с токенами/PII полностью;
- остальные `console.log` (их **сотни** по всему проекту, включая рендер-компоненты типа `BreadcrumbJsonLd`, `CityDisplay`, `DefaultContent`) вынести под единый `logger.debug()` с гейтом на `NODE_ENV !== 'production'`.

### 1.7 Неконтролируемый инпут в `ConfirmRegistratrionForm`

```tsx
const handleChange = (index, value) => {
  const newInput = inputsRef.current[index]
  if (newInput) newInput.value = value // прямая мутация DOM, не React state
}
```

Инпуты не controlled — значение читается через `ref.value` в момент сабмита. Это антипаттерн, ломается при concurrent-рендерах/StrictMode-двойном рендере, не даёт валидации на лету. Переписать на `useState<string[]>` + controlled inputs.

---

## 2. Дублирование кода (самое дорогое для поддержки)

### 2.1 HTTP-клиенты

`lib/http-client/httpClient.ts` (клиент) и `httpServer.ts` (сервер) — почти одинаковая логика построения запроса, обработки 401, headers, но реализована дважды с нуля, включая обработку файлов. `lib/http-client/index.ts` держит закомментированный `client()` — то есть половина фасада мертва в коде.

**Решение:** один `createHttpClient(getAuthToken: () => Promise<string | null>)` фабричный конструктор, который параметризуется способом получения токена (из cookie на клиенте / из request на сервере), а сама логика fetch/retry/error-mapping — одна.

### 2.2 Карточки (Card*)

`CardNomenclature`, `CardBrand`, `CardTenant`, `CardCounterparty`, `CardPromotion` — идентичная структура `card → cardLink → cardContent → infoSection → actionsSection`, идентичные SCSS-паттерны (`.card`, `.cardLink`, `.infoSection`, `.actionsSection` копипастятся в 5 файлах модулей почти 1-в-1). Разница только в наборе полей и иконках.

**Решение:** один generic `<EntityCard>` с slot-пропсами (`image`, `title`, `rows: InfoRow[]`, `actions`) + единый `EntityCard.module.scss`. Конкретные карточки становятся тонкими адаптерами данных.

### 2.3 `*Wrapper` компоненты и их SCSS

`CounterpartiesWrapper`, `PromotionsWrapper`, `BrandsWrapper`, `NomenclatureWrapper`, `TenantsWrapper` — у всех одинаковый скелет: `displayWrapper / filtersContainer / contentContainer / cardsWrapper / paginationContainer` + идентичный responsive SCSS (буквально копия файла 4 раза, включая закомментированные куски). Плюс у каждого — свой `use<Entity>` SWR-infinite хук с одинаковой логикой (`useBrands`, `useInfiniteNomenclatures`, `useGroupedTenants`, `useInfinityTenants`).

**Решение:**

- один `<ListWrapper>` layout-компонент (filters/content/pagination slots) + один shared `ListWrapper.module.scss`;
- один generic `useInfinitePaginatedResource<T>(endpoint, params)` хук поверх `useSWRInfinite`, конкретные хуки — просто вызов с урлом.

### 2.4 Логин/регистрация Desktop vs Mobile

`LoginFormDesktop` и `LoginFormMobile` — 90% идентичного кода (валидация, `useAuth`, показ/скрытие пароля, countdown блокировки). Разница только в разметке/классах. Та же история с `LoginDesktop.module.scss` и `LoginMobile.module.scss`, которые почти дублируют друг друга (там же дублируется полностью `ResetPassword.module.scss`).

**Решение:** вынести логику в `useLoginForm()` хук, а десктоп/мобайл оставить как чисто презентационные компоненты, либо вообще уйти от раздельных Desktop/Mobile веток на CSS-медиазапросы внутри одного компонента (тем более что часть страниц, например `LoginWrapper`, уже сейчас **всегда** рендерит только Desktop — мобильная ветка закомментирована, то есть код мёртвый уже сейчас).

### 2.5 API route error-handling

Практически в каждом `app/api/**/route.ts` повторяется один и тот же блок:

```ts
const status = error.message.includes('Session expired')
  ? 401
  : error.message.includes('Request failed')
    ? 502
    : 500
```

Скопировано в `counterparties`, `promotions`, `place`, `brands/assigned` и т.д. буквально дословно.

**Решение:** одна утилита `mapHttpClientError(error): { status, message }` в `lib/http-client`, и обёртка `withApiErrorHandling(handler)` для route-хендлеров, чтобы не писать try/catch с одинаковым телом в каждом файле.

### 2.6 SCSS-дублирование “grid карточек”

`.cardGrid` с одинаковыми breakpoints (`repeat(4,1fr)/repeat(2,1fr)/1fr` на 1024/768/480) продублирован в: `BrandsWrapper`, `CounterpartiesWrapper`, `PromotionsWrapper`, `NomenclatureItem.module.scss`, `TenantItems.module.scss`, `BrandItem.module.scss`, `CounterpartyItem.module.scss`, `promotions/card/PromotionItems.module.scss` — минимум 8 копий одного и того же responsive-грида.

**Решение:** один `_grid-mixins.scss` (или один общий класс `.cardGridBase` в глобальных стилях), остальные модули на него ссылаются.

---

## 3. Проблемы архитектуры данных/state

### 3.1 Двойное хранилище корзины (cookie + localStorage + zustand)

`useNomenclatureStore` — zustand с `persist` (localStorage) **и одновременно** ручная запись в cookie через `writeCookie`/`clearCookie` при каждом действии. Плюс `NomenclatureStoreProvider` при маунте читает cookie заново и делает отдельный fetch, чтобы восстановить `items`. Три источника правды для одного и того же списка id, которые могут разойтись (например, если пользователь почистил localStorage, но cookie осталась, или наоборот).

**Решение:** выбрать один источник (скорее всего cookie, так как он нужен для SSR в `/order`), zustand использовать только как in-memory кэш без `persist`, гидрировать из серверных данных при заходе на страницу.

### 3.2 Двойные запросы одних и тех же данных (metadata + page)

В `app/(main)/brands/[slug]/page.tsx`, `app/(main)/nomenclatures/[slug]/page.tsx` и других: `generateMetadata()` и сам page-компонент независимо друг от друга делают одинаковый `fetch`/`httpClient1CServer.get(...)`. Next.js дедуплицирует **нативный** `fetch` с одинаковыми параметрами в рамках одного рендера, но:

- `httpClient1CServer` использует `cache: 'no-store'`/кастомную обвязку — дедупликация Next.js может не сработать;
- часть запросов идёт напрямую через `fetch(...)` с `cache: 'no-store'`, что явно отключает мемоизацию.

**Решение:** обернуть загрузку данных в `React.cache()` (per-request memoization), чтобы `generateMetadata` и сам компонент страницы переиспользовали один и тот же результат.

### 3.3 Смешение SWR-конфигураций

`SWRProvider` ставит глобальный fetcher через `client.get(url)` (относительные `/api/...` пути), но часть хуков (`useBrandNomenclatures`) сама реализует свой `fetcher` с `fetch(url, {credentials:'include'})`, игнорируя глобальный. Несогласовано — часть запросов идёт через кастомный `httpClient1CClient` (с токеном из cookie на клиенте), часть — просто `fetch` к своим `/api` роутам. Нужно определиться: клиентские хуки всегда ходят в собственные `/api/*` роуты (BFF-паттерн), а не пытаются напрямую стучаться в 1С с токеном на клиенте — сейчас это делается непоследовательно.

---

## 4. TypeScript / качество кода

- `item: any` в `CardNomenclatureProps`, `error: any` почти во всех catch, `data: any` в `TooltipModal`. Стоит завести общий `ApiError` тип и типизировать данные карточек через union `INomenclatureItem | ICity`.
- В `types/nomenclature/index.ts` оставлен закомментированный старый интерфейс `INomenclatureItem` (~30 строк) — мёртвый код, который сбивает с толку при поиске актуального контракта.
- Много `console.log(...)`, оставленных как debug (`prepositional`, `data`, `userId`, `Загружены контрагенты:` и т.п.) — не относится к типам, но системно засоряет вывод и намекает на отсутствие code review перед мержем.
- `eslint.config.mjs` ссылается на `nextEslint`, которая **нигде не объявлена и не импортируется** — файл, скорее всего, сейчас просто падает или не применяется. Проверить, реально ли линтер работает в CI.

---

## 5. Организация папок — что несогласовано

- Часть доменов имеет отдельный `api/index.ts` service-layer (`app/(main)/orders/files/api`, `app/(main)/orders/playlists/api`) — хороший паттерн, но применён только в `orders/*`, а не во всём проекте. В `nomenclatures`, `brands`, `tenants` вся работа с данными расползлась прямо по `page.tsx` (fetch внутри `async function getX()` в файле страницы).
- `types/` частично дублирует экспорты (`IPromotionList` реэкспортируется из `types/index.ts`, хотя уже есть `types/promotion/index.ts` — непонятно, какой импортировать).
- Логика гео/города размазана по `hooks/useGeolocation`, `hooks/useCityDetection`, `store/geoStore`, `lib/api/geocoding`, `components/ui/geolocation/*` — само по себе нормально, но `useCityDetection.confirmCity` напрямую обращается к `useGeoStore.getState()` в обход паттерна хуков, что усложняет тестирование.
- Заглушки `PageDevelop` (страницы "в разработке": `/content`, `/media-plans`, `/tasks`, `/my-place`) держат вокруг себя мёртвый закомментированный код реальной реализации (`app/(main)/my-place/page.tsx` — 30 строк закомментированного fetch). Либо удалить, либо доделать — так эти файлы не несут пользы и не дают понять, готова фича или нет.

---

## 6. Целевая архитектура (что предлагаю)

```
app/
  (main)/...            — только page.tsx: layout + вызов use-case функций, без бизнес-логики
  api/                   — тонкие route-хендлеры: parse params → call service → withApiErrorHandling

lib/
  http/
    client.ts            — единая фабрика HTTP-клиента (browser/server через DI токена)
    errors.ts            — mapHttpClientError, ApiError, withApiErrorHandling
  auth/
    session.ts            — ЕДИНЫЙ источник авторизации (выбрать JWT-cookie ИЛИ iron-session)
  services/               — доменные сервисы поверх http-клиента:
    nomenclatures.service.ts
    brands.service.ts
    tenants.service.ts
    ...
    (заменяют разрозненные getXById в page.tsx и app/(main)/orders/*/api)

hooks/
  data/
    useInfinitePaginatedResource.ts   — общий хук пагинации (замена 4 копий)
    useEntitySelect.ts                 — общий хук для *Select компонентов
                                         (BrandSelect/CaSelect/TypeOfPlaceSelect/CitySelect
                                          дублируют debounce+SWR+infinite паттерн 1-в-1)

components/
  ui/
    card/
      EntityCard.tsx        — generic карточка (замена 5 Card*)
    list/
      ListWrapper.tsx        — generic layout список+фильтры+пагинация

styles/
  _grid.scss               — общий responsive card-grid mixin
  _card.scss                — общий card skeleton mixin

store/
  cartStore.ts              — единый источник (cookie как SSR-источник, zustand как in-memory кэш без persist)
```

Ключевые принципы для новой архитектуры:

1. **Один способ получить данные** — компонент/страница не делает `fetch` напрямую, а вызывает `service.getX()`, обёрнутый в `React.cache()`.
2. **Один способ пагинации** — весь infinite-scroll идёт через один generic хук с параметрами `{endpoint, query}`.
3. **Один источник авторизации** — cookie ИЛИ session, не оба сразу.
4. **UI-примитивы переиспользуются**, а не копируются под каждую сущность (карточки, списки, гриды, error-boundary).
5. **Логи — через `logger`**, который в проде no-op, а не голый `console.log`.

---

## 7. Приоритетный план действий

**P0 (безопасность, делать сразу):**

1. Убрать fallback `SESSION_SECRET` → падать при старте без env.
2. Переписать `crypto.ts` на AES-256-GCM со случайным IV на сообщение.
3. Убрать `console.log` с токенами/cookie из `httpClient.ts` / `httpServer.ts`.
4. Разобраться с двойной auth-системой — оставить одну.

**P1 (баги/качество, следующий спринт):** 5. Переименовать/поправить `generateNomenclatureMetadata.ts` ↔ `generateNomenclatureStructuredData.ts`. 6. Сделать `ConfirmRegistratrionForm` controlled-инпутами, исправить опечатку в имени (папка/файл/CSS-модуль). 7. Обернуть серверные data-fetch функции в `React.cache()`, убрать двойные запросы metadata/page. 8. Единая обработка ошибок в API routes (`withApiErrorHandling`).

**P2 (рефакторинг дублирования, по мере сил):** 9. Generic `EntityCard` вместо 5 карточек. 10. Generic `ListWrapper` + generic `useInfinitePaginatedResource`. 11. Слияние HTTP-клиентов в одну фабрику. 12. Общий SCSS для card-grid/card-skeleton. 13. Унификация cart-store (один источник правды).

**P3 (уборка):** 14. Удалить закомментированный мёртвый код (старые интерфейсы, закомментированные `PageDevelop`-реализации, отключённая мобильная логин-ветка). 15. Почистить `console.log` по всему проекту, завести `logger`. 16. Проверить, что `eslint.config.mjs` реально работает (`nextEslint` не определён).

Если нужно — могу взять любой из пунктов P1/P2 и сразу написать код (например, generic `EntityCard`, `useInfinitePaginatedResource` или единый HTTP-клиент) — какой начать первым?
