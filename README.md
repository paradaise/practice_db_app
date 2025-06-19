# 📦 Warehouse Materials API

REST API для учёта наличия и движения материалов на складе

---

## 🚀 Быстрый старт

### 1. Клонируй репозиторий и перейди в папку проекта

```sh
cd practice_db_app
```

### 2. Запусти MongoDB через Docker

```sh
docker-compose up -d
```

### 3. Установи зависимости

```sh
npm install
```

### 4. Сгенерируй тестовые данные (опционально)

```sh
node seed.js
```

### 5. Запусти сервер

```sh
npx nodemon app.js
# или
node app.js
```

---

## 🔗 Подключение к БД

- **MongoDB URI:** `mongodb://root:example@localhost:27017/?authSource=admin`
- Переменные окружения хранятся в `.env` (см. пример ниже)

```
MONGO_URI=mongodb://root:example@localhost:27017/?authSource=admin
PORT=3000
```

---

## 📚 Структура проекта

```
practice_db_app/
├── app.js            # Точка входа Express
├── models/           # Mongoose-модели (Material, Warehouse, Stock, Movement)
├── routes/           # CRUD-роуты для всех сущностей
├── seed.js           # Генерация тестовых данных (faker)
├── docker-compose.yml# Быстрый запуск MongoDB
├── .env              # Переменные окружения (не в git)
└── README.md         # Этот файл
```

---

## 🗄️ Коллекции и поля

### materials

- name (название)
- description (описание)
- unit (единица измерения)
- sku (артикул)
- price (цена)
- manufacturer (производитель)

### warehouses

- name (название)
- address (адрес)
- phone (телефон)
- email (email)
- manager (ответственный)

### stock

- material (ссылка на материал)
- warehouse (ссылка на склад)
- quantity (количество)
- lastUpdated (дата обновления)

### movements

- material (ссылка на материал)
- fromWarehouse (откуда)
- toWarehouse (куда)
- quantity (количество)
- date (дата)
- type (in/out/move)
- comment (комментарий)
- operator (оператор)

---

## 📬 Примеры API

- `GET    /api/materials` — список материалов
- `POST   /api/materials` — создать материал
- `GET    /api/materials/:id` — получить материал
- `PUT    /api/materials/:id` — обновить материал
- `DELETE /api/materials/:id` — удалить материал

(Аналогично для `/warehouses`, `/stock`, `/movements`)

---

## 🛠️ Тестирование и просмотр данных

- **Postman** — для тестирования API
- **MongoDB Compass** — для просмотра и редактирования коллекций
- **DBeaver** — универсальный GUI для БД

---

## 👤 Автор

- [Гоголев Виктор](https://github.com/paradaise)

---

> Сделано для учебных целей. Express + MongoDB + Docker + Faker
