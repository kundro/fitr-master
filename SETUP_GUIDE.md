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
DB/Database/00_Master_CreateTables.sql
```

Этот скрипт создаст ВСЕ таблицы:
- Flow, Flow_Node, Node, Pin, PinValue
- Connector, Alias, Platform
- User, User_Role, Assignment, Assignment_Submission

#### 1.3 Загрузите начальные данные
```sql
-- В SQL Server Management Studio откройте и выполните:
:r c:\Other\fitr-master\01_Seed_Data_NEW.sql
```

Этот скрипт создаст:
- **Роли**: Admin, Teacher, Student  
- **Admin пользователь**: admin@fitr.com (нужно зарегистрировать через API!)
- **Платформы**: System, Graphics
- **Ноды**: Input, Output, String Equals, Not, Debug, Sum, Concat, Multiply, Or, And, Message, Number Equals, Task Point
- **Пины**: 38 входов/выходов для всех нод

**ВАЖНО:** Admin user нужно зарегистрировать через API (чтобы BCrypt сгенерировал правильный hash), затем вручную установить `IsApproved=1` в базе данных.

#### 1.4 Создайте Admin пользователя

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

### ✅ Завершено
- [x] Анализ проекта и документация
- [x] Добавлено поле Color в Flow_Node (БД + DTOs + Mappers)
- [x] Созданы таблицы User, Role, Assignment, Submission
- [x] Созданы DTOs для новых таблиц
- [x] Обновлен DataContext с маппингом
- [x] Мастер-скрипт создания БД

### 🔄 В процессе
- [ ] Repositories для User, Assignment, Submission
- [ ] Services для Auth, Admin, Teacher, Student
- [ ] Controllers для API endpoints
- [ ] JWT Authentication middleware
- [ ] Password hashing (BCrypt)

### 📋 Планируется
- [ ] UI Login/Register страницы
- [ ] UI Admin dashboard (approval)
- [ ] UI Teacher dashboard (assignments)
- [ ] UI Student dashboard (submissions)
- [ ] Генерация цветов при добавлении флоу во флоу
- [ ] UI отображение цветов нод

---

## СЛЕДУЮЩИЕ ШАГИ

### Для продолжения разработки:

1. **Создать Repositories:**
   - `IUserRepository` + `UserRepository`
   - `IAssignmentRepository` + `AssignmentRepository`
   - `IAssignmentSubmissionRepository` + `AssignmentSubmissionRepository`

2. **Создать Services:**
   - `AuthService` (Login, Register, ValidateUser)
   - `AdminService` (ApproveTeacher, RejectTeacher)
   - `TeacherService` (CreateAssignment, GradeSubmission, ApproveStudent)
   - `StudentService` (GetAssignments, SubmitAssignment)

3. **Создать Controllers:**
   - `AuthController`
   - `AdminController`
   - `TeacherController`
   - `StudentController`

4. **Добавить Authentication:**
   - JWT Token generation
   - BCrypt password hashing
   - Auth middleware
   - Role-based authorization

5. **Создать UI:**
   - Login page
   - Register page с выбором роли
   - Admin dashboard
   - Teacher dashboard
   - Student dashboard

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
