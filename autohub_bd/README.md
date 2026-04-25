# AutoHub Backend

Django REST API для мережі автосалонів AutoHub. БД — спільний хмарний Postgres на [Neon](https://neon.tech).

## Перший запуск (після клонування репо)

```bash
cd autohub_bd
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# відредагуй .env: вкажи DATABASE_URL від Neon і GOOGLE_OAUTH_CLIENT_ID
python manage.py migrate            # без помилок: таблиці вже є у спільній БД
python manage.py runserver
```

API: http://127.0.0.1:8000/api/
Admin: http://127.0.0.1:8000/admin/

## Тестові акаунти

| Роль       | Email               | Пароль    |
|------------|---------------------|-----------|
| Адмін      | admin@autohub.ua    | admin123  |
| Користувач | user@autohub.ua     | user123   |

Або через Google Sign-In на `/login` чи `/register`.

## Звідки взяти DATABASE_URL

Це connection string до Neon Postgres. Отримай у власника проекту (Yulia) через приватний канал. Формат:
```
postgresql://user:pass@host/dbname?sslmode=require
```

⚠️ Це секрет — не комітити в git і не публікувати.

Якщо хочеш свою окрему БД для розробки:
1. Створи безкоштовний проект на neon.tech (regіон Frankfurt)
2. Поклади connection string у `.env` як `DATABASE_URL=...`
3. `python manage.py migrate` створить таблиці
4. `python manage.py loaddata fixtures/seed.json` наповнить базовими даними

## Як оновити seed-дані

Зазвичай не потрібно — БД спільна, всі бачать одне і те саме одразу. Файл `fixtures/seed.json` потрібен лише для нових Postgres-баз або щоб «скинути» БД до базового стану.

Якщо все-таки треба оновити (наприклад, перед тим як хтось буде розгортати свій dev-Postgres):

```bash
python manage.py dumpdata users.CustomUser dealerships cars \
  --indent 2 --natural-foreign --natural-primary \
  -o fixtures/seed.json
```

Закомітити `fixtures/seed.json`.

## Структура

- `autohub/` — конфіг Django (settings, urls)
- `users/` — кастомний `CustomUser` (email-логін, ролі user/admin) + Google Sign-In
- `dealerships/` — автосалони
- `cars/` — Brand → CarModel → Generation → Car (+ CarImage, Favorite)
- `bookings/` — запис на тест-драйв
- `fixtures/seed.json` — мінімальний набір даних для нової БД
