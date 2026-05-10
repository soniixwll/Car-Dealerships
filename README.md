# AutoHub

Онлайн-платформа мережі автосалонів: каталог авто, порівняння, запис на тест-драйв, особистий кабінет.

- **Backend:** Django + Django REST Framework, JWT-авторизація, Google Sign-In, Postgres (Neon у проді / SQLite локально)
- **Frontend:** React (Create React App), React Router, Context API, i18n
- **Інфраструктура:** Docker Compose для одночасного запуску бекенду й Postgres

## Структура проєкту

```
.
├── autohub_bd/         # Django REST API (бекенд)
├── autohub-frontend/   # React SPA (фронтенд)
├── docker-compose.yml  # Postgres + Django одним стеком
└── README.md           # цей файл
```

Детальні README є в кожній теці:
- Бекенд: [`autohub_bd/README.md`](autohub_bd/README.md)
- Фронтенд: стандартний CRA, скрипти нижче

## Швидкий старт (рекомендований шлях через Docker)

Потрібен Docker Desktop і Node.js 18+.

### 1. Бекенд + база (одна команда)

```bash
cp autohub_bd/.env.example autohub_bd/.env
# відкрий autohub_bd/.env і встав GOOGLE_OAUTH_CLIENT_ID (за наявності)

docker compose up --build
```

Перший запуск підніме Postgres і застосує міграції. Після старту:

```bash
docker compose exec backend python manage.py loaddata fixtures/seed.json
docker compose exec backend python manage.py createsuperuser
```

API доступний на http://127.0.0.1:8000/api/, адмінка — http://127.0.0.1:8000/admin/.

### 2. Фронтенд

В окремому терміналі:

```bash
cd autohub-frontend
cp .env.example .env
# відкрий .env і встав REACT_APP_GOOGLE_CLIENT_ID (за потреби)

npm install
npm start
```

Сайт відкриється на http://localhost:3000.

## Альтернатива: локально без Docker

Якщо не хочеш Docker — підніми бекенд через venv (детальна інструкція у [`autohub_bd/README.md`](autohub_bd/README.md)) і фронтенд через `npm start` як вище.

## Тестові акаунти

| Роль       | Email             | Пароль   |
|------------|-------------------|----------|
| Адмін      | admin@autohub.ua  | admin123 |
| Користувач | user@autohub.ua   | user123  |

Або зареєструйся на `/register`, або увійди через Google.

## Що вміє сайт

- **Каталог** з фільтрами (марка, ціна, рік, пробіг) і сортуванням
- **Сторінка авто** з галереєю, характеристиками, калькулятором утримання, схожими авто
- **Порівняння** обраних моделей пліч-о-пліч
- **Салони** — список дилерських центрів по містах з контактами
- **Запис на тест-драйв** з вибором салону, дати, часу
- **Особистий кабінет**: улюблені, історія тест-драйвів, переглянуті авто, налаштування
- **Реєстрація / вхід** через email або Google
- Адаптивна верстка, світла/темна тема, i18n

## Тести

```bash
# бекенд
cd autohub_bd
python manage.py test

# фронтенд
cd autohub-frontend
npm test
```

## Корисні команди Docker

```bash
docker compose up --build       # запустити стек
docker compose down             # зупинити
docker compose down -v          # зупинити + видалити дані Postgres
docker compose logs -f backend  # логи бекенду
```

## Контакти

Питання щодо проєкту або доступу до спільної БД — до власника проєкту.
