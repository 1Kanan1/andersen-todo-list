# 📝 Andersen TODO List

A minimal Django + DRF backend for personal task management with JWT auth.

---

## ⚙️ Tech Stack

- **Django 5.2**
- **Django REST Framework**
- **PostgreSQL**
- **JWT Auth (SimpleJWT)**
- **Docker + Docker Compose**
- **pytest + pytest-django**
- **django-environ**

---

## 🚀 Features

| Feature            | Description                                                    |
| ------------------ | -------------------------------------------------------------- |
| 🔐 JWT Auth        | Register, login, refresh tokens                                |
| 👤 User Accounts   | Custom user model, separate app                                |
| ✅ Task CRUD       | Create, read, update, delete tasks with owner-only permissions |
| 📊 Filter & Status | Filter tasks by `"New"`, `"In Progress"`, `"Completed"`        |
| 📄 Pagination      | DRF pagination enabled on task list                            |
| 🐳 Docker Support  | Dev & test containers via Docker Compose                       |
| 🧪 Test Suite      | `pytest` for both apps, tests are runnable inside Docker       |

---

## 🧬 Project Structure

```
.
├── config/             # Django settings, URLs, ASGI/WGI
├── tasks/              # Task model, views, permissions, tests
├── users/              # Custom user model, registration, tests
├── .env.example        # Sample env vars
├── docker-compose.yml  # Dev container setup
├── compose.test.yml    # Test container setup
├── Dockerfile
├── pytest.ini
└── requirements.txt
```

---

## 🔑 API Overview

### 🔐 Auth

#### `POST /users/register/`

Registers a new user.

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "password": "jdoe123"
}
```

> [!note]
> Here, `last_name` is optional

#### `POST /api/token/`

Logs in and returns access & refresh tokens.

```json
{
  "username": "johndoe",
  "password": "jdoe123"
}
```

#### `POST /api/token/refresh/`

Refreshes the access token.

```json
{
  "refresh": "your_refresh_token"
}
```

---

### 📋 Tasks

> [!important]
> All endpoints below require authentication with:
>
> ```
> Authorization: Bearer <access_token>
> ```

#### `POST /tasks/`

Creates a new task.

```json
{
  "title": "Finish project report",
  "description": "Include Q3 metrics and charts",
  "status": "New"
}
```

#### `GET /tasks/?page=<int>`

Gets paginated list of tasks (`PAGE_LIMIT = 10`)

#### `PUT /tasks/<int:pk>/`

Updates a task (e.g., to mark as completed).

```json
{
  "title": "Finish project report",
  "description": "Include Q3 metrics and charts",
  "status": "Completed"
}
```

> [!note]
> Operation supports partial update (e.g., you can specify only `status`)

#### `DELETE /tasks/<int:pk>/`

Deletes a task

---

## 🐳 Run with Docker

```bash
docker-compose up --build
```

Then visit: [http://localhost:8000](http://localhost:8000)

---

## 🧪 Run Tests

**With Docker:**

```bash
docker-compose -f compose.test.yml run --rm test
```

**Or Locally:**

```bash
pytest
```

---

## 🔐 Environment Setup

Use `.env.example` as a starting point (don't forget to rename to `.env`):

```env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

POSTGRES_DB=todo_list
POSTGRES_USER=youruser
POSTGRES_PASSWORD=yourpass
POSTGRES_HOST=postgres_db
POSTGRES_PORT=5432
```

> [!note]
>
> 1. You can either remove `SECRET_KEY` or use [djecrety.ir](https://djecrety.ir/) to generate it
> 2. Set `0.0.0.0` in `ALLOWED_HOSTS` to run **Docker** (or `127.0.0.1` for **manual setup**)

---

## 🛠 Manual Dev Setup (no Docker)

> [!important]
> Do not forget to set `POSTGRES_HOST` to `localhost`

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
python manage.py migrate
python manage.py runserver
```
