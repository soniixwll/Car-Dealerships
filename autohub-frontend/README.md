# AutoHub Frontend

React додаток для мережі автосалонів AutoHub.

## Запуск

```bash
npm install
npm start
```

Відкриється на http://localhost:3000

## Потрібен запущений бекенд на http://127.0.0.1:8000

## Структура

```
src/
├── context/AppContext.js   — глобальний стан (мова, юзер, обране, порівняння)
├── services/api.js         — всі запити до бекенду
├── i18n.js                 — переклади UA/EN
├── components/
│   ├── Navbar.js           — навігація
│   ├── Footer.js           — підвал
│   ├── CarCard.js          — картка авто
│   └── BookingModal.js     — модал запису на тест-драйв
└── pages/
    ├── Home.js             — головна
    ├── Catalog.js          — каталог з фільтрами
    ├── CarDetail.js        — деталі авто
    ├── Salons.js           — салони
    ├── Compare.js          — порівняння
    ├── Login.js            — вхід
    ├── Register.js         — реєстрація
    └── Profile.js          — профіль
```
