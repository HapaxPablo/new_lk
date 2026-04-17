# SEO Configuration Guide

## 📋 Обзор

Приложение полностью настроено для SEO оптимизации с следующими компонентами:

- ✅ **robots.txt** - управление индексацией поисковиков
- ✅ **Dynamic Sitemap** - автоматический sitemap всех маршрутов
- ✅ **Canonical URLs** - избежание дублей контента
- ✅ **JSON-LD структурированные данные** - для поисковиков и соцсетей
- ✅ **OpenGraph теги** - оптимизация для соцсетей
- ✅ **Яндекс.Метрика** - интеграция аналитики
- ✅ **BreadcrumbList** - структурированные данные для навигации

---

## ⚙️ Переменные окружения

Добавьте эти переменные в `.env.local`:

```env
# Основной домен приложения
NEXT_PUBLIC_SITE_URL=https://krasrm.com

# Яндекс.Метрика ID (обязательно для аналитики)
NEXT_PUBLIC_YANDEX_METRICA_ID=12345678

# Google Site Verification (опционально)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=

# Yandex Site Verification (опционально)
NEXT_PUBLIC_YANDEX_SITE_VERIFICATION=
```

### Как получить Яндекс.Метрика ID:

1. Перейти на https://metrica.yandex.ru
2. Создать новый счетчик
3. Получить ID счетчика (это число, например `12345678`)
4. Добавить в `.env.local` как `NEXT_PUBLIC_YANDEX_METRICA_ID`

---

## 📁 Структура файлов SEO

```
app/
├── layout.tsx                    # Root layout с Organization JSON-LD и Яндекс.Метрика
├── sitemap.ts                    # Динамический sitemap.xml

public/
├── robots.txt                    # Правила для поисковиков

lib/configs/config-meta/
├── configMetaData.ts             # Главная конфигурация SEO + Organization данные
├── nomenclatures/
│   ├── generateNomenclatureMetadata.ts           # Metadata для страниц номенклатур
│   ├── generateNomenclatureStructuredData.ts     # JSON-LD для продуктов

components/seo/
├── BreadcrumbJsonLd.tsx          # Компонент для BreadcrumbList JSON-LD

providers/analytics/
├── YandexMetricaProvider.tsx     # Провайдер Яндекс.Метрика
```

---

## 🔧 Использование компонентов

### 1. BreadcrumbList на иерархических страницах

```tsx
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'

export default function NomenclaturePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Главная', url: 'https://krasrm.com' },
          { name: 'Номенклатуры', url: 'https://krasrm.com/nomenclatures' },
          {
            name: 'Название продукта',
            url: 'https://krasrm.com/nomenclatures/123',
          },
        ]}
      />
      {/* страница контент */}
    </>
  )
}
```

### 2. Динамическая metadata для страниц

```tsx
import { generateNomenclatureMetadata } from '@/lib/configs/config-meta/nomenclatures/generateNomenclatureMetadata'

export async function generateMetadata({ params }) {
  const nomenclature = await fetchNomenclature(params.id)
  return generateNomenclatureMetadata({
    nomenclature,
    id: params.id,
  })
}
```

### 3. JSON-LD структурированные данные для продуктов

```tsx
import { generateNomenclatureStructuredData } from '@/lib/configs/config-meta/nomenclatures/generateNomenclatureStructuredData'
import Script from 'next/script'

export default function ProductPage({ nomenclature, id }) {
  const structuredData = generateNomenclatureStructuredData(nomenclature, id)

  return (
    <>
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {/* страница контент */}
    </>
  )
}
```

---

## 🔍 Проверка SEO

### 1. Проверить robots.txt

```
http://localhost:3000/robots.txt
```

Должен содержать Allow/Disallow правила и ссылку на sitemap.

### 2. Проверить sitemap.xml

```
http://localhost:3000/sitemap.xml
```

Должен содержать все основные маршруты приложения в XML формате.

### 3. Проверить JSON-LD в Google Rich Results Test

- Перейти на https://search.google.com/test/rich-results
- Вставить URL вашей страницы
- Проверить что JSON-LD структурированные данные корректны

### 4. Проверить Яндекс.Метрика

- Открыть DevTools Console
- Проверить что нет ошибок при загрузке скрипта
- Перезагрузить страницу и проверить в Яндекс.Метрике что счетчик отправляет данные

### 5. Проверить Open Graph теги

```bash
# В DevTools > Elements > head
# Должны быть видны:
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:url" content="..." />
```

---

## 📊 Данные организации (Organization JSON-LD)

Организация автоматически добавляется в root layout с следующими данными:

```json
{
  "name": "Агентство активной рекламы КрасРМ",
  "url": "https://krasrm.com",
  "logo": "https://krasrm.com/logo_footer.svg",
  "description": "Агентство активной рекламы в Красноярске",
  "telephone": "+7-800-500-50-50",
  "email": "info@krasrm.com",
  "address": {
    "streetAddress": "ул. Красной Армии, 10, стр. 3., оф. 2-02",
    "addressLocality": "Красноярск",
    "addressCountry": "RU"
  }
}
```

Для изменения этих данных, отредактируйте `app/layout.tsx` в функции `RootLayout`.

---

## 🚀 Дальнейшие улучшения

### Для Google Search Console:

1. Перейти на https://search.google.com/search-console
2. Добавить домен `krasrm.com`
3. Добавить verification code в `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
4. Проверить robots.txt и sitemap в Search Console

### Для Яндекс.Вебмастера:

1. Перейти на https://webmaster.yandex.ru
2. Добавить сайт `krasrm.com`
3. Добавить verification code в `NEXT_PUBLIC_YANDEX_SITE_VERIFICATION`
4. Проверить robots.txt и sitemap в Вебмастере

### Дополнительные действия:

- Добавить FAQPage JSON-LD если есть FAQ разделы
- Добавить ReviewSchema если есть отзывы пользователей
- Оптимизировать изображения (использовать Next.js Image компонент)
- Добавить Content Sitemaps если много динамического контента
- Настроить Mobile-First индексацию в Search Console

---

## 📚 Ссылки

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org справочник](https://schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Яндекс.Вебмастер](https://webmaster.yandex.ru)
- [Google Search Console](https://search.google.com/search-console)
