# Агропорт MVP

Новая реализация MVP платформы «Агропорт»: публичный лендинг, кабинет пользователя, профиль физлица, хозяйства, анкета хозяйства, проверка организации и минимальная админка.

Старый Next.js прототип сохранен в `legacy_frontend/` и используется только как reference для текстов, маршрутов и визуальных идей.

## Архитектура

- `frontend/` — Next.js 16 App Router, React, TypeScript, Tailwind CSS.
- `backend/` — FastAPI, Tortoise ORM, Aerich, PostgreSQL, Pydantic, JWT auth.
- `docker-compose.yml` — локальный PostgreSQL.

Локально публичная зона доступна на `/`, приложение на `/app`. В будущем структура рассчитана на `agroport.ru` и `app.agroport.ru`.

## Запуск PostgreSQL

```bash
docker compose up -d postgres
```

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e .
cp ../.env.example .env
aerich init -t app.db.TORTOISE_ORM
aerich init-db
python -m app.seed
uvicorn app.main:app --reload
```

Swagger: `http://localhost:8000/docs`.

Health:

- `GET http://localhost:8000/api/v1/health`
- `GET http://localhost:8000/api/v1/health/db`

## Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend: `http://localhost:3000`.

## Тестовые пользователи

- Admin: `admin@agroport.local` / `admin12345`
- Demo user: `farmer@agroport.local` / `farmer12345`

## Реализованные страницы

- `/` — публичный лендинг.
- `/login` — вход.
- `/register` — регистрация физлица.
- `/app` — dashboard.
- `/app/profile` — профиль физлица.
- `/app/organizations` — список хозяйств.
- `/app/organizations/new` — создание хозяйства.
- `/app/organizations/[id]` — карточка хозяйства.
- `/app/organizations/[id]/questionnaire` — анкета хозяйства.
- `/admin/organizations` — минимальная админка проверки хозяйств.

## Placeholder-разделы

Через единый компонент заглушки закрыты `/app/support`, `/app/finance`, `/app/export`, `/app/marketplace`, `/app/cooperation`, `/app/learning`, `/app/events`, `/app/applications`, `/app/services`, `/app/support-center`, `/app/products`, `/app/requests`.

## API endpoints

- `GET /api/v1/health`
- `GET /api/v1/health/db`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/users/me/profile`
- `PATCH /api/v1/users/me/profile`
- `GET /api/v1/organizations`
- `POST /api/v1/organizations`
- `GET /api/v1/organizations/{organization_id}`
- `PATCH /api/v1/organizations/{organization_id}`
- `POST /api/v1/organizations/{organization_id}/submit-verification`
- `GET /api/v1/organizations/{organization_id}/profile`
- `PUT /api/v1/organizations/{organization_id}/profile`
- `GET /api/v1/admin/organizations`
- `POST /api/v1/admin/organizations/{organization_id}/approve`
- `POST /api/v1/admin/organizations/{organization_id}/reject`

## Auth note

Для MVP frontend хранит JWT access token в `localStorage` и отправляет `Authorization: Bearer <token>`. Для production нужно перейти на httpOnly cookie или session-cookie auth.

## Следующий этап

- Добавить полноценные тесты backend и frontend.
- Перевести auth на httpOnly cookie/session.
- Расширить админку пользователями и аудитом действий.
- Развивать placeholder-разделы в реальные сценарии заявок, marketplace, мер поддержки и сервисов.

## Development and CI/CD

- Локально работай в feature-ветках и пушь готовое в `main`.
- GitHub Actions запускает проверку frontend/backend на каждый PR и push в `main`.
- После успешного push в `main` workflow подключается по SSH к серверу и делает `git reset --hard origin/main`, `docker compose build`, `docker compose up -d`, `aerich upgrade`, затем smoke-check health endpoints.
- `.env` хранится только на сервере и не должен попадать в репозиторий.
- Для деплоя нужны GitHub Secrets: `DEPLOY_HOST`, `DEPLOY_PORT`, `DEPLOY_USER`, `DEPLOY_PATH`, `DEPLOY_SSH_KEY`.
