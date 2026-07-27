####tititit

# TODO: Доработка недостающих страниц

## Фаза 1: Контрагенты (counterparties) - Приоритет 1
- [x] Создать страницу списка: `app/(main)/counterparties/page.tsx`
- [x] Создать API роут: `app/api/counterparties/route.ts` (использовать аналог nomenclatures)
- [x] Создать страницу детализации: `app/(main)/counterparties/[id]/page.tsx`
- [x] Создать компонент карточки: `components/counterparties/card/CounterpartiesItem.tsx`
- [x] Создать типы: `types/counterparties/index.ts`

## Фаза 2: Акции (promotions) - Приоритет 2
- [ ] Создать API роут: `app/api/promotions/route.ts`
- [ ] Обновить страницу: `app/promotions/page.tsx`
- [ ] Создать страницу детализации: `app/promotions/[id]/page.tsx`
- [ ] Создать компонент карточки: `components/promotions/card/PromotionItem.tsx`
- [ ] Создать типы: `types/promotion/index.ts`

## Фаза 3: Мои места (my-place) - Приоритет 3
- [ ] Создать API роут: `app/api/my-place/route.ts`
- [ ] Обновить страницу: `app/(main)/my-place/page.tsx` (использовать аналог nomenclatures)

## Фаза 4: Ролики (content) - Приоритет 4
- [ ] Создать страницу: `app/(main)/content/page.tsx`
- [ ] Создать компонент: `components/content/ContentWrapper.tsx`
- [ ] Создать карточку: `components/content/card/ContentItems.tsx`
- [ ] Создать типы: `types/content/index.ts`
- [ ] Добавить в NAV_ITEMS когда API будет готово

## Фаза 5: Медиапланы (media-plans) - Приоритет 5
- [ ] Создать страницу: `app/(main)/media-plans/page.tsx`
- [ ] Создать компонент: `components/media-plans/MediaPlansWrapper.tsx`
- [ ] Создать карточку: `components/media-plans/card/MediaPlanItems.tsx`
- [ ] Создать типы: `types/media-plan/index.ts`
- [ ] Добавить в NAV_ITEMS когда API будет готово

## Фаза 6: Задачи (tasks) - Приоритет 6
- [ ] Создать страницу: `app/(main)/tasks/page.tsx`
- [ ] Создать компонент: `components/tasks/TasksWrapper.tsx`
- [ ] Создать карточку: `components/tasks/card/TaskItems.tsx`
- [ ] Создать типы: `types/task/index.ts`
- [ ] Добавить в NAV_ITEMS когда API будет готово

## Общие задачи
- [ ] Обновить configMenuHeader.ts после готовности всех API
- [ ] Проверить работу пагинации на всех страницах
- [ ] Проверить работу фильтров (использовать существующие FilterPanels)

