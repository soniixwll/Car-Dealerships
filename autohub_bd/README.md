# AutoHub Backend

Django REST API для мережі автосалонів AutoHub.

## Перший запуск (після клонування репо)

```bash
cd autohub_bd
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata fixtures/seed.json
python manage.py runserver
```

API: http://127.0.0.1:8000/api/
Admin: http://127.0.0.1:8000/admin/

## Тестові акаунти (зі `seed.json`)

| Роль       | Email               | Пароль    |
|------------|---------------------|-----------|
| Адмін      | admin@autohub.ua    | admin123  |
| Користувач | user@autohub.ua     | user123   |

## Як оновити seed-дані

Тільки адмін/розробник з доступом до репо. Після того як додав/змінив дані локально:

```bash
python manage.py dumpdata users.CustomUser dealerships cars \
  --indent 2 --natural-foreign --natural-primary \
  -o fixtures/seed.json
```

Закомітити `fixtures/seed.json` — інші отримають оновлення через `git pull` + `loaddata`.

> ⚠️ `loaddata` перезаписує існуючі записи з тими ж id. Якщо хочеш чисту базу — видали `db.sqlite3`, зроби `migrate` і `loaddata` заново.

## Структура

- `autohub/` — конфіг Django (settings, urls)
- `users/` — кастомний `CustomUser` (email-логін, ролі user/admin)
- `dealerships/` — автосалони
- `cars/` — Brand → CarModel → Generation → Car (+ CarImage)
- `bookings/` — запис на тест-драйв
- `fixtures/seed.json` — мінімальний набір даних для старту
