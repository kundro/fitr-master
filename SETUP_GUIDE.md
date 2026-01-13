# FITR - Руководство по запуску проекта

## Обзор проекта

FITR - это визуальная среда для создания и выполнения блок-схем (flows) с системой обучения.

**Архитектура:**
- **Backend:** ASP.NET Core Web API (.NET 6)
- **Frontend:** React + TypeScript
- **Database:** SQL Server

---

## ЧТО БЫЛО РЕАЛИЗОВАНО

### ✅ 1. Поддержка цветов для нод
- Добавлено поле `Color` в таблицу `Flow_Node`
- Цвета передаются через API и отображаются в UI
- Когда флоу добавляется во флоу, можно присвоить цвет его нодам

### ✅ 2. Структура базы для авторизации
- Таблицы: `User_Role`, `User`, `Assignment`, `Assignment_Submission`
- DTOs и маппинг в Entity Framework
- Роли: Admin, Teacher, Student
- Система approval: Admin → Teacher, Teacher → Student

### 🔄 3. В процессе
- API Controllers для Auth, Admin, Teacher, Student
- Services для бизнес-логики
- UI для Login/Register
- JWT Authentication

---

## БЫСТРЫЙ СТАРТ

### Шаг 1: Подготовка базы данных

#### 1.1 Создайте новую базу данных
```sql
CREATE DATABASE FITR;
GO
USE FITR;
GO
```

#### 1.2 Запустите мастер-скрипт создания таблиц
```sql
-- В SQL Server Management Studio откройте и выполните:
:r c:\Other\fitr-master\DB\Database\00_Master_CreateTables.sql
```

Этот скрипт создаст ВСЕ таблицы:
- Flow, Flow_Node, Node, Pin, PinValue
- Connector, Alias, Platform
- User, User_Role, Assignment, Assignment_Submission

#### 1.3 Загрузите базовые данные (Platform, Node, Pin и т.д.)
```sql
-- В SQL Server Management Studio откройте и выполните:
:r c:\Other\fitr-master\script2.sql
```

Этот скрипт создаст:
- **Платформы**: System, Graphics, Test, New (4 платформы)
- **Ноды**: Input, Output, String Equals, Not, Debug, Sum, Concat, Multiply и другие (17 нод)
- **Пины**: Все входы/выходы для нод (74 пина)
- **Данные**: Alias, Connector, PinValue для всех флоу

#### 1.4 Загрузите данные Flow с координатами для UI
```sql
-- В SQL Server Management Studio откройте и выполните:
:r c:\Other\fitr-master\script1.sql
```

Этот скрипт создаст:
- **24 Flow** (Задача1-17, Test, Update Test и другие)
- **452 Flow_Node** с координатами X,Y для визуального редактора

**⚠️ ВАЖНО:** Полная документация по порядку выполнения скриптов находится в [DATABASE_EXECUTION_ORDER.md](DATABASE_EXECUTION_ORDER.md)

#### 1.5 (Опционально) Добавьте роли
```sql
-- Только если нужны роли для Auth системы:
SET IDENTITY_INSERT [dbo].[User_Role] ON 
INSERT [dbo].[User_Role] ([Id], [Name]) VALUES (1, N'Admin')
INSERT [dbo].[User_Role] ([Id], [Name]) VALUES (2, N'Teacher')
INSERT [dbo].[User_Role] ([Id], [Name]) VALUES (3, N'Student')
SET IDENTITY_INSERT [dbo].[User_Role] OFF
GO
```

#### 1.6 Создайте Admin пользователя

Поскольку BCrypt hashing происходит в коде, admin нужно создать через API:

**Шаг 1: Зарегистрируйте admin через API**
```bash
# Метод 1: С помощью Postman
POST https://localhost:5001/api/auth/register
Content-Type: application/json

{
  "email": "admin@fitr.com",
  "password": "Admin123!",
  "firstName": "System",
  "lastName": "Administrator",
  "roleName": "Admin"
}

# Метод 2: С помощью PowerShell
$body = @{
    email = "admin@fitr.com"
    password = "Admin123!"
    firstName = "System"
    lastName = "Administrator"
    roleName = "Admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://localhost:5001/api/auth/register" `
    -Method Post `
    -Body $body `
    -ContentType "application/json" `
    -SkipCertificateCheck
```

**Шаг 2: Approve admin вручную в базе данных**
```sql
UPDATE [User] 
SET IsApproved = 1, 
    ApprovedDate = GETDATE(),
    ApprovedBy = (SELECT Id FROM [User] WHERE Email = 'admin@fitr.com')
WHERE Email = 'admin@fitr.com';
```

**Шаг 3: Теперь можно войти**
```bash
POST https://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "admin@fitr.com",
  "password": "Admin123!"
}

# Ответ:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "admin@fitr.com",
  "firstName": "System",
  "lastName": "Administrator",
  "role": "Admin"
}
```

---

### Шаг 2: Настройка Backend (API)

#### 2.1 Откройте проект API
```bash
cd c:\Other\fitr-master\API
```

#### 2.2 Обновите connection string
Откройте файл: `Server.Api/appsettings.Development.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=FITR;Trusted_Connection=True;"
  }
}
```

Замените на ваши данные SQL Server.

#### 2.3 Восстановите пакеты и соберите проект
```bash
# В папке API/
dotnet restore
dotnet build
```

#### 2.4 Запустите API
```bash
cd Server.Api
dotnet run
```

API должен запуститься на `https://localhost:5001` или `http://localhost:5000`

---

### Шаг 3: Настройка Frontend (UI)

#### 3.1 Откройте проект UI
```bash
cd c:\Other\fitr-master\UI
```

#### 3.2 Установите зависимости
```bash
npm install
```

#### 3.3 Проверьте API URL
Откройте файл: `UI/src/app/api.ts`

Убедитесь что URL указывает на ваш API:
```typescript
const API_URL = 'http://localhost:5000/api';
```

#### 3.4 Запустите UI
```bash
npm start
```

UI откроется в браузере на `http://localhost:3000`

---

## СТРУКТУРА ПРОЕКТА

### Backend (API)

```
API/
├── Server.Api/              # Точка входа, Controllers
│   ├── Controllers/
│   │   ├── FlowController.cs
│   │   ├── PlatformController.cs
│   │   └── RunController.cs
│   ├── Program.cs           # Точка запуска
│   └── Startup.cs           # Конфигурация DI, Middleware
│
├── Server.Application/      # Бизнес-логика
│   ├── Services/           # FlowService, PlatformService и т.д.
│   ├── Mappers/            # DTO ↔ Entity мапперы
│   ├── Models/
│   │   ├── Input/          # Модели для запросов
│   │   └── Output/         # Модели для ответов
│   └── Contracts/          # Интерфейсы сервисов
│
├── Server.Data/            # Доступ к данным
│   ├── Dtos/               # Entity классы (Flow, Node и т.д.)
│   ├── Contexts/           # DbContext (EF Core)
│   ├── Repositories/       # Реализации репозиториев
│   └── Contracts/          # Интерфейсы репозиториев
│
└── Server.Common/          # Общий код
    ├── Dtos/               # Базовые Entity классы
    ├── Enums/              # Перечисления
    ├── Filters/            # FilterOptions
    └── Models/             # Базовые модели
```

**Как работает слоистая архитектура:**

1. **HTTP Request** → Controller (Server.Api)
2. **Controller** → Service (Server.Application)
3. **Service** → Repository (Server.Data)
4. **Repository** → Database (через EF Core)
5. **Database** → Repository → Service → Controller
6. **Controller** → HTTP Response

**Пример потока данных:**
```
GET /api/flows/1
  ↓
FlowController.GetFlow(1)
  ↓
FlowService.GetFlowAsync(1)
  ↓
FlowRepository.GetAsync(1)
  ↓
DbContext.Flows.Find(1)
  ↓
SQL: SELECT * FROM Flow WHERE Id = 1
  ↓
Flow Entity → FlowOutputModel
  ↓
JSON Response
```

---

### Database Schema

**Core Flow Tables:**
- `Platform` - Языки программирования (Python, JavaScript и т.д.)
- `Node` - Шаблоны нод (Input, Output, If, Loop и т.д.)
- `Pin` - Входы/выходы нод
- `Flow` - Блок-схемы
- `Flow_Node` - Ноды в конкретном флоу (с позицией X,Y и **Color**)
- `PinValue` - Значения пинов
- `Connector` - Связи между нодами
- `Alias` - Переменные

**Authentication & Learning:**
- `User_Role` - Роли (Admin, Teacher, Student)
- `User` - Пользователи с approval статусом
- `Assignment` - Задания от учителей
- `Assignment_Submission` - Решения студентов с оценками

---

### Frontend (UI)

```
UI/src/
├── index.tsx              # Точка входа React
├── App.tsx                # Главный компонент
└── app/
    ├── flows/             # Компоненты работы с флоу
    │   ├── components/    # React компоненты
    │   └── models/        # TypeScript интерфейсы
    ├── platforms/         # Платформы и ноды
    ├── runs/              # Выполнение флоу
    └── api.ts             # Axios HTTP клиент
```

---

## ТЕСТИРОВАНИЕ

### 1. Проверьте API
Откройте в браузере: `http://localhost:5000/api/platforms`

Должен вернуться JSON со списком платформ.

### 2. Проверьте UI
Откройте: `http://localhost:3000`

Должна появиться главная страница с меню.

### 3. Создайте флоу
1. Перейдите в "Flows"
2. Нажмите "New Flow"
3. Добавьте ноды из меню слева
4. Соедините ноды
5. Сохраните

---

## ТЕКУЩИЙ СТАТУС РЕАЛИЗАЦИИ

### ✅ Backend MVP - ПОЛНОСТЬЮ ГОТОВ!
- [x] База данных (13 таблиц)
- [x] Repositories (User, Assignment, Submission, UserRole)
- [x] Services (Auth, Admin, Teacher, Student)
- [x] Controllers (Auth, Admin, Teacher, Student) 
- [x] JWT Authentication + BCrypt hashing
- [x] Seed data (Platform, Node, Pin, Roles)
- [x] API документация
- [x] Admin user создан и работает

### 🎯 Следующие шаги

**Вариант 1: Тестирование Backend**
- [ ] Протестировать все endpoints через Postman
- [ ] Создать Teacher и Student пользователей
- [ ] Проверить approval workflow
- [ ] Создать тестовые Assignment
- [ ] Проверить submission и grading

**Вариант 2: Frontend разработка**
- [ ] UI Login/Register страницы
- [ ] UI Admin dashboard (approval teachers)
- [ ] UI Teacher dashboard (assignments + grading)
- [ ] UI Student dashboard (submissions)
- [ ] Auth context + protected routes

**Вариант 3: Flow Colors**
- [ ] Генерация цветов при добавлении флоу во флоу
- [ ] UI отображение цветов нод
- [ ] Color picker в редакторе

---

## 🚀 ЧТО ДЕЛАТЬ ДАЛЬШЕ?

### Вариант 1: Протестировать Backend (рекомендуется)

Убедитесь что все endpoints работают правильно:

```bash
# 1. Создайте Teacher
POST https://localhost:5001/api/auth/register
{
  "email": "teacher@fitr.com",
  "password": "Teacher123!",
  "firstName": "John",
  "lastName": "Doe",
  "roleName": "Teacher"
}

# 2. Login как Admin и approve teacher
POST https://localhost:5001/api/auth/login (admin)
GET https://localhost:5001/api/admin/pending-teachers
POST https://localhost:5001/api/admin/approve-teacher/2

# 3. Создайте Student
POST https://localhost:5001/api/auth/register
{
  "email": "student@fitr.com",
  "password": "Student123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "roleName": "Student"
}

# 4. Login как Teacher и approve student
POST https://localhost:5001/api/auth/login (teacher)
POST https://localhost:5001/api/teacher/approve-student/3

# 5. Создайте Assignment
POST https://localhost:5001/api/teacher/assignments
{
  "title": "Task 1",
  "description": "Create a simple flow",
  "dueDate": "2026-02-01",
  "flowId": 1
}

# 6. Submit assignment как Student
POST https://localhost:5001/api/student/submit
{
  "assignmentId": 1,
  "flowId": 2,
  "comments": "My solution"
}

# 7. Grade submission как Teacher
POST https://localhost:5001/api/teacher/grade-submission
{
  "submissionId": 1,
  "score": 95,
  "feedback": "Excellent work!"
}
```

### Вариант 2: Начать Frontend разработку

Создать React компоненты для:
1. **Login/Register** страницы
2. **Admin Dashboard** (список pending teachers, approve/reject)
3. **Teacher Dashboard** (assignments, grading, approve students)
4. **Student Dashboard** (view assignments, submit)

### Вариант 3: Реализовать Flow Colors

Добавить логику автоматической генерации цветов когда один флоу добавляется в другой флоу.

---

## СЛЕДУЮЩИЕ ШАГИ

### Для продолжения разработки:

**Backend (✅ Готово!):**
- ✅ Все Repositories созданы
- ✅ Все Services реализованы
- ✅ Все Controllers работают
- ✅ JWT Authentication настроен
- ✅ BCrypt password hashing работает

**Frontend (⏳ Ожидает реализации):**
1. **Auth UI:**
   - Login page с формой email/password
   - Register page с выбором роли (Teacher/Student)
   - Auth context для управления токеном
   - Protected routes для authenticated пользователей

2. **Admin UI:**
   - Dashboard с pending teachers
   - Approve/Reject кнопки для каждого teacher

3. **Teacher UI:**
   - Список pending students
   - Форма создания assignment
   - Список своих assignments
   - Submissions с формой grading

4. **Student UI:**
   - Список доступных assignments
   - Форма submission
   - Просмотр своих submissions с оценками

**Flow Colors (⏳ Ожидает реализации):**
- Автоматическая генерация цвета при добавлении флоу во флоу
- Color picker в UI
- Отображение цветов в визуальном редакторе

---

## 📊 Готовые API Endpoints

### Authentication
- ✅ POST `/api/auth/register` - Регистрация
- ✅ POST `/api/auth/login` - Вход
- ✅ GET `/api/auth/me` - Текущий пользователь

### Admin
- ✅ GET `/api/admin/pending-teachers` - Список ожидающих
- ✅ POST `/api/admin/approve-teacher/{id}` - Утвердить
- ✅ POST `/api/admin/reject-teacher/{id}` - Отклонить

### Teacher
- ✅ GET `/api/teacher/pending-students` - Список ожидающих студентов
- ✅ POST `/api/teacher/approve-student/{id}` - Утвердить
- ✅ POST `/api/teacher/reject-student/{id}` - Отклонить
- ✅ POST `/api/teacher/assignments` - Создать задание
- ✅ GET `/api/teacher/assignments` - Мои задания
- ✅ GET `/api/teacher/submissions/{assignmentId}` - Submissions
- ✅ POST `/api/teacher/grade-submission` - Оценить

### Student
- ✅ GET `/api/student/assignments` - Доступные задания
- ✅ GET `/api/student/submission/{assignmentId}` - Моя submission
- ✅ POST `/api/student/submit` - Отправить решение

### Flows (Existing)
- ✅ GET `/api/flows` - Все flows
- ✅ GET `/api/flows/{id}` - Flow по ID
- ✅ POST `/api/flows` - Создать flow
- ✅ PUT `/api/flows` - Обновить flow
- ✅ DELETE `/api/flows/{id}` - Удалить flow

---

## TROUBLESHOOTING

### Проблема: API не запускается
**Решение:**
- Проверьте connection string в appsettings.Development.json
- Убедитесь что SQL Server запущен
- Проверьте что база FITR создана

### Проблема: UI не подключается к API
**Решение:**
- Проверьте URL в UI/src/app/api.ts
- Убедитесь что API запущен
- Проверьте CORS настройки в Startup.cs

### Проблема: Ошибки компиляции API
**Решение:**
```bash
dotnet clean
dotnet restore
dotnet build
```

### Проблема: Ошибки npm в UI
**Решение:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

---

## КОНТАКТЫ И ПОДДЕРЖКА

Проект разработан как дипломная работа БНТУ.

Для вопросов создавайте issues в репозитории проекта.

---

**Последнее обновление:** 14 января 2026

**Версия:** 2.0.0 (полностью переработанная с нуля)
