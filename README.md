# 🏦 Bank Cash Operations ( REST API + UI + NoSQL DB )  

REST API для учёта кассовых операций коммерческого банка.

---

## 🚀 Быстрый старт

### 1. Запусти MongoDB через Docker

```sh
docker-compose up -d
```

### 2. Установи зависимости

```sh
npm install
```

### 3. Сгенерируй тестовые данные (опционально)

```sh
node seed.js
```

_Скрипт очистит старые данные и создаст новые: 5 кассиров, 20 клиентов со счетами и 50 транзакций._

### 4. Запусти сервер

```sh
npx nodemon app.js
```

_Сервер запустится на порту 3000._

---

## 🔗 Подключение к БД

- **MongoDB URI:** `mongodb://root:example@localhost:27017/?authSource=admin`
- Данные для подключения хранятся в `.env` файле.

---

## 🗄️ Коллекции (сущности)

### `clients` — Клиенты

- `firstName`, `lastName`, `middleName`
- `passportSeries`, `passportNumber`
- `tin` (ИНН)
- `type` (individual/legal)

### `accounts` — Счета

- `clientId` (ссылка на клиента)
- `accountNumber` (номер счёта)
- `currency` (RUB/USD/EUR)
- `balance` (баланс)
- `status` (active/closed/frozen)

### `transactions` — Транзакции

- `type` (deposit/withdrawal/transfer)
- `amount` (сумма)
- `currency` (валюта)
- `fromAccount`, `toAccount` (ссылки на счета)
- `cashierId` (ссылка на кассира)
- `comment`

### `cashiers` — Кассиры

- `firstName`, `lastName`
- `position` (должность)
- `branch` (отделение)

---

## 📬 Эндпоинты API

- `/api/clients`
- `/api/accounts`
- `/api/transactions`
- `/api/cashiers`

Каждый эндпоинт поддерживает стандартные CRUD-операции (`GET`, `POST`, `PUT`, `DELETE`).

---

## 🛠️ Инструменты

- **Тестирование API:** Postman, Insomnia
- **Просмотр БД:** MongoDB Compass, DBeaver

---

> Сделано для учебных целей.

---

## Планы:
- [ ] Добавить фото примеры БД в Mongoose, страниц UI, примеры групп запросов из Postman
- [ ] Приложить мой отчет по практике
