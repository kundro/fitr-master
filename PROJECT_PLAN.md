# FITR Project - Полный анализ и план реализации

## ТЕКУЩЕЕ СОСТОЯНИЕ ПРОЕКТА (после отката)

### 1. Архитектура приложения

Проект состоит из 3 основных частей:

#### **API (Backend) - .NET Core**
```
API/
├── Server.Api/              - Точка входа, контроллеры, конфигурация
│   ├── Controllers/         - REST API endpoints
│   ├── Program.cs          - Точка запуска
│   └── Startup.cs          - Конфигурация сервисов
│
├── Server.Application/      - Бизнес-логика
│   ├── Services/           - Сервисы (FlowService, PlatformService и т.д.)
│   ├── Mappers/            - Маппинг между DTO и моделями
│   └── Models/             - Input/Output модели для API
│
├── Server.Data/            - Работа с базой данных
│   ├── Dtos/               - Entities (Flow, Node, Pin и т.д.)
│   ├── Contexts/           - EF Core DbContext
│   ├── Repositories/       - Репозитории для доступа к данным
│   └── Contracts/          - Интерфейсы репозиториев
│
└── Server.Common/          - Общие классы, енамы, фильтры
    ├── Dtos/               - Базовые Entity классы
    ├── Enums/              - Перечисления
    ├── Filters/            - FilterOptions для пагинации
    └── Models/             - Базовые модели
```

**Принцип работы слоев:**
1. **Controller** получает HTTP запрос
2. **Service** обрабатывает бизнес-логику
3. **Repository** работает с базой данных через EF Core
4. **Mapper** преобразует Entity → OutputModel или InputModel → Entity

#### **Database (SQL Server)**
```
DB/Database/
├── dbo/
│   └── Tables/            - SQL скрипты создания таблиц
│       ├── Flow.sql
│       ├── Flow_Node.sql
│       ├── Node.sql
│       ├── Platform.sql
│       └── ...
└── DataScripts/
    └── Initialize/        - Начальные данные
```

**Текущие таблицы:**
- `Flow` - блок-схемы
- `Flow_Node` - ноды во флоу
- `Node` - шаблоны нод
- `Platform` - платформы (языки программирования)
- `Pin` - входы/выходы нод
- `PinValue` - значения пинов
- `Connector` - связи между нодами
- `Alias` - алиасы для переменных

**ВАЖНО:** Нет User, Role, Assignment таблиц!

#### **UI (Frontend) - React + TypeScript**
```
UI/
├── src/
│   ├── app/
│   │   ├── flows/         - Компоненты работы с флоу
│   │   ├── platforms/     - Компоненты платформ
│   │   ├── runs/          - Компоненты запуска флоу
│   │   └── models/        - TypeScript модели
│   ├── index.tsx          - Точка входа
│   └── App.tsx            - Главный компонент
└── package.json
```

---

## ЧТО НУЖНО РЕАЛИЗОВАТЬ

### Задача 1: Цвета для нод из добавленных флоу

**Требование:**
- Когда флоу добавляется во флоу (как подфлоу), все его ноды должны получить уникальный цвет
- Обычные ноды (добавленные напрямую) остаются без цвета
- НЕ нужны группы, названия, свертывание - только цвет!

**Решение:**
1. Добавить `Color NVARCHAR(50) NULL` в таблицу `Flow_Node`
2. Добавить `public string Color { get; set; }` в `FlowNode.cs`
3. При добавлении флоу во флоу - генерировать случайный цвет и присваивать всем нодам этого флоу
4. В UI отображать цвет на нодах

---

### Задача 2: Система авторизации с ролями

**Требование:**
- 3 роли: Admin, Teacher, Student
- Регистрация → Approval → Логин
- Иерархия approval:
  - **Admin** утверждает Teachers
  - **Teachers** утверждают Students
  - **Admin** создается при инициализации БД
- UI: Login страница, Register страница, Admin/Teacher panel для approval

**Структура БД:**

```sql
-- Роли
User_Role:
  Id, Name, Description

-- Пользователи
User:
  Id, Email, Password (hash), FirstName, LastName, 
  RoleId, IsApproved, CreatedDate, ApprovedBy, ApprovedDate

-- Задания (только Teachers создают)
Assignment:
  Id, TeacherId, FlowId, Title, Description, 
  DueDate, MaxScore, IsActive

-- Решения студентов
Assignment_Submission:
  Id, AssignmentId, StudentId, 
  SubmittedDate, Score, Status, TeacherFeedback
```

**Workflow:**
1. Пользователь регистрируется → статус `IsApproved = false`
2. Admin видит список Teachers на approval → approve или reject
3. Teacher видит список Students на approval → approve или reject
4. После approval пользователь может логиниться
5. Teacher создает Assignment из своих Flows
6. Student видит Assignments, выполняет → Submit
7. Teacher видит Submissions, ставит оценку

---

### Задача 3: Чистые SQL скрипты

**Требование:**
- Один мастер-скрипт создающий все таблицы с нуля
- Без миграций, просто CREATE TABLE
- Включить начальные данные (Admin user, Roles, Sample Platforms/Nodes)

**План:**
1. `01_CreateTables.sql` - все таблицы
2. `02_SeedData.sql` - начальные данные
3. `00_Master.sql` - запускает все по порядку

---

## ПЛАН РЕАЛИЗАЦИИ

### Этап 1: Цвета для нод ✅
1. SQL: Добавить `Color` в `Flow_Node` таблицу
2. C#: Добавить `Color` в `FlowNode.cs`
3. C#: Обновить `DataContext.cs`
4. C#: В `FlowService` при добавлении флоу → генерировать цвет
5. UI: Отображать цвет нод

### Этап 2: База для авторизации ✅
1. SQL: Создать таблицы `User_Role`, `User`, `Assignment`, `Assignment_Submission`
2. C#: Создать DTOs для новых таблиц
3. C#: Создать Repositories и Services
4. C#: Обновить `DataContext.cs`

### Этап 3: API для авторизации ✅
1. Controllers: `AuthController` (Login, Register)
2. Controllers: `AdminController` (Approve Teachers)
3. Controllers: `TeacherController` (Approve Students, Create Assignments)
4. Controllers: `StudentController` (Get Assignments, Submit)
5. Middleware: JWT authentication

### Этап 4: UI для авторизации ✅
1. Login/Register страницы
2. Admin dashboard
3. Teacher dashboard
4. Student dashboard
5. Routing и защита роутов

### Этап 5: SQL скрипты ✅
1. Создать полные скрипты создания БД
2. Seed данные

### Этап 6: Документация ✅
1. Руководство по запуску
2. Описание архитектуры
3. API документация

---

## СЛЕДУЮЩИЕ ШАГИ

Сейчас я начну реализацию по этапам:
1. Сначала добавлю цвета
2. Потом создам всю систему авторизации
3. Затем SQL скрипты
4. И финальную документацию

Файл будет обновляться по мере выполнения задач.

---

## СТАТУС ВЫПОЛНЕНИЯ

- [ ] Этап 1: Цвета для нод
- [ ] Этап 2: База для авторизации
- [ ] Этап 3: API для авторизации
- [ ] Этап 4: UI для авторизации
- [ ] Этап 5: SQL скрипты
- [ ] Этап 6: Документация
