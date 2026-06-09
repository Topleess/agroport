# Аудит MVP «Агропорт»

Дата аудита: 8 июня 2026  
Окружение: `http://127.0.0.1:3000`, API `http://127.0.0.1:8000/api/v1`  
Формат проверки: визуальный обход приложения + статический осмотр frontend/backend + проверка health endpoints.

## Краткое резюме

MVP уже работает как базовый кабинет агропользователя: есть публичный лендинг, регистрация, вход, защищенная зона, профиль физлица, список организаций, карточка организации, анкета хозяйства, каталог продукции организации и минимальная админка проверки организаций.

Большая часть будущих продуктовых направлений уже заведена в маршрутах и навигации, но пока реализована как подготовленные заглушки: marketplace, меры поддержки, финансы, сервисы, обучение, события, заявки, центр поддержки, экспорт, кооперация и часть разделов внутри профиля/организации.

Текущая база содержит тестовые данные:

| Сущность | Фактическое состояние |
| --- | --- |
| Пользователи | `admin@agroport.local` и `farmer@agroport.local` |
| Основной профиль | Иван Фермер, роль «Руководитель хозяйства», Московская область |
| Организация 1 | КФХ Зеленое поле, ИНН 500100000001, статус `verified`, анкета 90% |
| Организация 2 | 232, ИНН 232323232323, статус `rejected`, анкета не заполнена |
| Продукция организации 1 | `test` и `22`, добавлены в ходе тестирования |

## Что уже готово

### Пользовательские сценарии

- Публичный лендинг объясняет MVP и ведет во вход, регистрацию и платформу.
- Регистрация создает пользователя и сохраняет JWT в `localStorage`.
- Вход работает по email/телефону и паролю.
- `/app` защищен и редиректит в `/app/profile`.
- Профиль физлица отображается и редактируется.
- Список организаций показывает доступные хозяйства и статусы проверки.
- Создание организации реализовано через wizard с выбором категории.
- Карточка организации показывает реквизиты, статус и быстрые переходы в разделы.
- Анкета хозяйства загружает и сохраняет профиль организации.
- Продукция организации имеет форму добавления и список позиций.
- Админка отображает организации, фильтрует по статусу и вызывает approve/reject API.

### Backend/API

Проверки перед аудитом:

| Endpoint | Результат |
| --- | --- |
| `GET /api/v1/health` | `{"status":"ok"}` |
| `GET /api/v1/health/db` | `{"status":"ok"}` |

Реализованные API-группы:

| Группа | Возможности |
| --- | --- |
| Auth | регистрация, вход, выход, текущий пользователь |
| Users | получение и обновление профиля физлица |
| Organizations | список, lookup, создание, карточка, изменение, отправка на проверку |
| Organization profile | получение и сохранение анкеты хозяйства |
| Organization products | список, создание и обновление продукции |
| Admin | список организаций, подтверждение, отклонение |

## Карта навигации

```mermaid
flowchart TD
  Landing["/ Лендинг"] --> Login["/login Вход"]
  Landing --> Register["/register Регистрация"]
  Landing --> AppRoot["/app"]
  AppRoot --> Profile["/app/profile Профиль физлица"]
  Profile --> ProfileEdit["/app/profile/edit Редактирование профиля"]
  Profile --> ProfileOrgs["/app/profile/organizations Организации"]
  ProfileOrgs --> Orgs["/app/organizations Список организаций"]
  Orgs --> OrgNew["/app/organizations/new Новая организация"]
  Orgs --> OrgProfile["/app/organizations/:id Карточка организации"]
  OrgProfile --> Questionnaire["/questionnaire Анкета"]
  OrgProfile --> Products["/products Продукция"]
  OrgProfile --> OrgPlaceholders["users/applications/services/verification Заглушки"]
  Profile --> ProfilePlaceholders["notifications/applications/learning/events/services Заглушки"]
  Profile --> PlatformPlaceholders["marketplace/support/finance/services/learning/... Заглушки"]
  Profile --> Admin["/admin/organizations Админка"]
```

Глобальная шапка содержит верхние направления: «Спрос и продажи», «Инвестиции», «Субсидии», «Сервисы», «Обучение», поиск, общее меню и меню пользователя. Внутри профиля есть боковая навигация по личным разделам. Внутри организации есть отдельная боковая навигация: профиль физлица, профиль организации, анкета, продукция, пользователи, заявки, сервисы, проверка.

## Таблица экранов

| Маршрут | Назначение | Статус | Ключевые действия/API |
| --- | --- | --- | --- |
| `/` | Публичный лендинг | Готово | Переходы в `/login`, `/register`, `/app` |
| `/login` | Вход | Готово | `POST /auth/login` |
| `/register` | Регистрация | Готово | `POST /auth/register` |
| `/app` | Корень кабинета | Готово | redirect в `/app/profile` |
| `/app/profile` | Профиль физлица | Готово | `GET /users/me/profile`, переход в редактирование и организации |
| `/app/profile/edit` | Редактирование профиля | Готово | `PATCH /users/me/profile` |
| `/app/profile/organizations` | Организации в личном кабинете | Готово | `GET /organizations`, переходы в карточки |
| `/app/organizations` | Список хозяйств | Готово | `GET /organizations`, переход в создание/карточку |
| `/app/organizations/new` | Создание организации | Частично готово | `GET /organizations/lookup`, `POST /organizations`; wizard без полноценной проверки реестров |
| `/app/organizations/1` | Карточка организации | Готово | `GET /organizations/{id}`, `POST /submit-verification` для draft |
| `/app/organizations/1/questionnaire` | Анкета хозяйства | Готово | `GET/PUT /organizations/{id}/profile` |
| `/app/organizations/1/products` | Продукция организации | Частично готово | `GET/POST /organizations/{id}/products`; редактирование API есть, UI редактирования не видно |
| `/app/organizations/1/users` | Пользователи организации | Заглушка | Отдельный маршрут и навигация есть, данных/ролей в UI нет |
| `/app/organizations/1/applications` | Заявки организации | Заглушка | Отдельный маршрут без данных |
| `/app/organizations/1/services` | Сервисы организации | Заглушка | Отдельный маршрут без данных |
| `/app/organizations/1/verification` | Проверка организации | Заглушка | Описание будущего статуса/истории, действий нет |
| `/app/profile/notifications` | Уведомления пользователя | Заглушка | Будущие статусы проверок/ответов |
| `/app/profile/applications` | Личные заявки | Заглушка | Будущая история заявок |
| `/app/profile/learning` | Личное обучение | Заглушка | Будущие курсы/вебинары |
| `/app/profile/events` | Личные мероприятия | Заглушка | Будущие регистрации/приглашения |
| `/app/profile/services` | Личные сервисы | Заглушка | Будущие подключенные сервисы |
| `/app/marketplace` | Marketplace | Заглушка | План: карточки товаров, запросы покупателей, сервисы поставщиков |
| `/app/support` | Меры поддержки | Заглушка | План: подбор программ, проверка условий, чек-листы |
| `/app/finance` | Финансы | Заглушка | План: кредиты, гарантии, лизинг |
| `/app/services` | Каталог сервисов | Заглушка | План: бухгалтерия, логистика, цифровые решения |
| `/app/learning` | Обучение | Заглушка | План: программы, календарь, материалы |
| `/app/export` | Экспорт | Заглушка | План: чек-листы, требования рынков |
| `/app/cooperation` | Кооперация | Заглушка | План: партнеры, совместные заявки |
| `/app/events` | События | Заглушка | План: календарь и регистрация |
| `/app/applications` | Заявки | Заглушка | План: единая история заявок |
| `/app/support-center` | Центр поддержки | Заглушка | План: обращения, база знаний |
| `/app/products` | Общая витрина товаров | Заглушка | План: карточки продукции, остатки, публикация |
| `/app/requests` | Запросы | Заглушка | План: создание запроса, ответы поставщиков |
| `/admin/organizations` | Админка проверки | Частично готово | `GET /admin/organizations`, approve/reject; frontend не скрывает страницу по роли до ответа API |

## Что предстоит сделать

### Приоритет 1: довести MVP-сценарии до надежного состояния

- Добавить автоматические тесты для auth, профиля, организаций, анкеты, продукции и админки.
- Закрыть админскую страницу на frontend по роли, а не только backend-запросами.
- Добавить понятные empty/error/loading состояния на все рабочие страницы.
- Развести seed-данные и пользовательские тестовые данные: сейчас в БД уже есть ручные тестовые товары и организация `232`.
- Проверить сценарии прав доступа: обычный пользователь, владелец организации, admin.

### Приоритет 2: превратить заглушки в рабочие разделы

- Для организации: пользователи/доступы, заявки, сервисы, проверка с историей и комментариями.
- Для профиля: уведомления, личные заявки, обучение, мероприятия, сервисы.
- Для платформы: marketplace, меры поддержки, финансы, сервисы, обучение, события, обращения.
- Для продукции: редактирование/удаление, публикация в витрине, статусы, остатки или доступность.

### Приоритет 3: продуктовая и техническая зрелость

- Перенести auth с `localStorage` JWT на httpOnly cookie/session перед production.
- Добавить аудит действий администратора и историю изменения статусов.
- Добавить валидацию ИНН/ОГРН/КПП и нормализацию полей на frontend.
- Сделать навигацию по ролям и статусам: не показывать недоступные действия.
- Добавить UX для поиска: сейчас overlay поиска визуально есть, но фактический поиск не реализован.

## Технические наблюдения и риски

- Frontend: Next.js 16 App Router, React, TypeScript, Tailwind CSS. По правилу проекта при будущих изменениях нужно сверяться с `node_modules/next/dist/docs/`.
- Backend: FastAPI, Tortoise ORM, Aerich, PostgreSQL, JWT auth.
- AuthGuard проверяет наличие токена и `GET /auth/me`; роль администратора на странице `/admin/organizations` не проверяется заранее на frontend.
- Backend корректно использует `require_admin` для admin API.
- JWT хранится в `localStorage`, что подходит для MVP, но не для production.
- Заглушки сделаны не пустыми: они имеют маршруты, тексты и планируемые возможности, что удобно для дальнейшего развертывания разделов.
- Визуальная навигация уже ближе к большой платформе, чем к маленькому MVP; важно не потерять фокус на 2-3 основных рабочих сценариях.

## Галерея скриншотов

### Публичная зона и auth

![Лендинг](screenshots/public-home.png)

![Вход](screenshots/auth-login.png)

![Регистрация](screenshots/auth-register.png)

### Личный кабинет

![Профиль физлица](screenshots/profile-view.png)

![Редактирование профиля](screenshots/profile-edit.png)

![Организации в профиле](screenshots/profile-organizations.png)

### Организации

![Список организаций](screenshots/organizations-list.png)

![Создание организации](screenshots/organizations-new.png)

![Карточка организации](screenshots/organization-profile.png)

![Анкета хозяйства](screenshots/organization-questionnaire.png)

![Продукция организации](screenshots/organization-products.png)

### Разделы организации-заглушки

![Пользователи организации](screenshots/organization-users-placeholder.png)

![Заявки организации](screenshots/organization-applications-placeholder.png)

![Сервисы организации](screenshots/organization-services-placeholder.png)

![Проверка организации](screenshots/organization-verification-placeholder.png)

### Профильные заглушки

![Уведомления](screenshots/profile-notifications-placeholder.png)

![Личные заявки](screenshots/profile-applications-placeholder.png)

![Личное обучение](screenshots/profile-learning-placeholder.png)

![Мероприятия](screenshots/profile-events-placeholder.png)

![Личные сервисы](screenshots/profile-services-placeholder.png)

### Платформенные заглушки

![Marketplace](screenshots/platform-marketplace-placeholder.png)

![Меры поддержки](screenshots/platform-support-placeholder.png)

![Финансы](screenshots/platform-finance-placeholder.png)

![Сервисы](screenshots/platform-services-placeholder.png)

![Обучение](screenshots/platform-learning-placeholder.png)

![Экспорт](screenshots/platform-export-placeholder.png)

![Кооперация](screenshots/platform-cooperation-placeholder.png)

![События](screenshots/platform-events-placeholder.png)

![Заявки](screenshots/platform-applications-placeholder.png)

![Центр поддержки](screenshots/platform-support-center-placeholder.png)

![Товары](screenshots/platform-products-placeholder.png)

![Запросы](screenshots/platform-requests-placeholder.png)

### Админка

![Админка проверки организаций](screenshots/admin-organizations.png)

## Проверка артефактов

- Снято 33 скриншота desktop-версии.
- Все изображения сохранены в `docs/screenshots/`.
- Отчет ссылается на изображения относительными путями, чтобы Markdown корректно открывался из `docs/audit.md`.
- Код приложения, API, схемы и UI не изменялись.
