## Описание структуры

```bash
new-lk/
│
├── app/ 📁 App Router - основная директория
│ │
│ ├── (auth)/ 🔒 Группа маршрутов для аутентификации
│ │ ├── login/
│ │ │ └── page.tsx 🖥️ Страница входа
│ │ └── register/
│ │ └── page.tsx 🖥️ Страница регистрации
│ │
│ ├── (main)/ 🏠 Основная группа маршрутов
│ │ ├── nomenclatures/
│ │ │ └── page.tsx 🪪 Номенклатура
│ │ ├── dashboard/
│ │ │ └── page.tsx 📊 Дашборд
│ │ └── settings/
│ │ └── page.tsx ⚙️ Настройки
│ │
│ ├── api/ 🌐 API endpoints
│ │ └── auth/
│ │ └── route.ts 🚀 Пример API route
│ │ └── nomenclatures/
│ │ └── route.ts    Пример API route
│ │
│ ├── layout.tsx 🖼️ Root layout
│ ├── page.tsx 🏡 Главная страница
│ └── template.tsx 📜 Шаблон для страниц
│
├── components/ 🧩 UI компоненты
│ ├── ui/ 🔘 Базовые элементы (кнопки, карточки)
│ ├── layouts/ 🖼️ Компоненты макетов
│ └── shared/ 🔄 Общие компоненты
│
├── lib/ 🧰 Вспомогательные функции
│ ├── api/ клиент для http запросов
│ ├── config/ 🗂️ файлы конфигураций   
├── styles/ 🎨 Глобальные стили
│ ├── globals.css 🌍 Основные стили
│ └── theme/ 🎨 Тема оформления
│
├── types/ 📜 TypeScript типы
├── hooks/ 🎣 Кастомные хуки
│
├── middleware.ts 🔐 Middleware
├── next.config.js ⚙️ Конфиг Next.js
├── package.json 📦 Зависимости
│
├── public/ 📁 Статические файлы
│ ├── images/ 🖼️ Изображения
│ └── favicon.ico 🖼️ Иконка сайта
│
└── tsconfig.json 🛠️ Конфиг TypeScript
```

### Основные директории

- **`app/`** - Главная директория с роутингом приложения
  - `(auth)/` - Группа маршрутов для аутентификации
  - `(main)/` - Основные защищенные маршруты
  - `api/` - API endpoints
  - `layout.tsx` - Корневой layout приложения
  - `page.tsx` - Главная страница

### Вспомогательные директории

- **`components/`** - Переиспользуемые UI компоненты
  - `ui/` - Базовые элементы интерфейса
  - `layouts/` - Компоненты макетов
  - `shared/` - Общие компоненты

- **`lib/`** - Вспомогательные функции и утилиты
- **`styles/`** - Глобальные стили и темы
- **`types/`** - TypeScript типы
- **`hooks/`** - Кастомные React хуки

### Конфигурационные файлы

- `middleware.ts` - Middleware для обработки маршрутов
- `next.config.js` - Конфигурация Next.js
- `tsconfig.json` - Настройки TypeScript
- `package.json` - Зависимости проекта
