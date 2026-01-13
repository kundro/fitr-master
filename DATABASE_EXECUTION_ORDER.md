# ПОРЯДОК ВЫПОЛНЕНИЯ СКРИПТОВ БАЗЫ ДАННЫХ FITR

## ⚠️ ВАЖНО: ВЫПОЛНЯЙТЕ СКРИПТЫ СТРОГО В УКАЗАННОМ ПОРЯДКЕ!

---

## Подготовка

### 1. Создайте новую базу данных
```sql
CREATE DATABASE FITR;
GO
USE FITR;
GO
```

---

## Порядок выполнения скриптов

### Шаг 1: Создание структуры таблиц
**Файл:** `DB/Database/00_Master_CreateTables.sql`

**Что создает:**
- Все таблицы для Flow системы: Platform, Node, Pin, Flow, Flow_Node, PinValue, Connector, Alias, PinValue_Alias
- Таблицы авторизации: User_Role, User, Assignment, Assignment_Submission
- Все Foreign Key ограничения

**Выполнение:**
```sql
-- В SQL Server Management Studio
:r c:\Other\fitr-master\DB\Database\00_Master_CreateTables.sql
```

**Результат:** 13 таблиц созданы с правильными связями.

---

### Шаг 2: Загрузка базовых данных (Platform, Node, Pin, и т.д.)
**Файл:** `script2.sql`

**Что содержит:**
- Platform: System, Graphics, Test, New (4 платформы)
- Node: Input, Output, String Equals, Not, Debug, Sum, Concat, Multiply, Or, And, Message, Number Equals, Task Point и другие (17 нод)
- Pin: Все входы/выходы для нод (74 пина)
- Alias: Переменные для всех флоу
- Connector: Связи между нодами во флоу
- PinValue: Значения пинов в конкретных флоу
- PinValue_Alias: Связи между значениями пинов и алиасами

**⚠️ Изменения по сравнению с оригиналом:**
- ❌ Удалены CREATE TABLE statements (таблицы создаются в Шаге 1)
- ✅ Изменено: `USE [Splate]` → `USE [FITR]`
- ✅ Удалено поле `IsPublic` из Pin INSERTs (его нет в новой схеме)
- ✅ Удалены поля `Description` и `Author` из Platform INSERTs (их нет в новой схеме)

**Выполнение:**
```sql
-- В SQL Server Management Studio
:r c:\Other\fitr-master\script2.sql
```

**Результат:** 
- 4 Platforms
- 17 Nodes
- 74 Pins
- Множество Alias, Connector, PinValue записей

---

### Шаг 3: Загрузка данных Flow и Flow_Node
**Файл:** `script1.sql`

**Что содержит:**
- **24 Flow** (блок-схемы с задачами):
  - Задача1, Задача2, Задача3... Задача17
  - Test, New Flow, Concat test, Update Test и другие
- **452 Flow_Node** (ноды с координатами X,Y для визуального редактора)
  - Input, Output, Task Point, String Equals, Message и другие
  - Позиции X, Y для отображения в UI

**⚠️ Изменения по сравнению с оригиналом:**
- ✅ Изменено: `USE [Splate]` → `USE [FITR]`
- ℹ️ Поле `Color` в Flow_Node: nullable в новой схеме, INSERT без него сработает (будет NULL)

**Выполнение:**
```sql
-- В SQL Server Management Studio
:r c:\Other\fitr-master\script1.sql
```

**Результат:** 
- 24 Flows
- 452 Flow_Node instances с координатами

---

## Шаг 4: Seed данные для ролей (опционально)

Если хотите добавить роли (Admin, Teacher, Student):

**Файл:** `01_Seed_Data_NEW.sql` (опционально)

```sql
:r c:\Other\fitr-master\01_Seed_Data_NEW.sql
```

Но **ВНИМАНИЕ:** в 01_Seed_Data_NEW.sql уже есть некоторые Platform, Node, Pin записи. Они могут конфликтовать с данными из script2.sql. Рекомендуется использовать ТОЛЬКО для вставки ролей:

```sql
-- Только роли из 01_Seed_Data_NEW.sql:
SET IDENTITY_INSERT [dbo].[User_Role] ON 
INSERT [dbo].[User_Role] ([Id], [Name]) VALUES (1, N'Admin')
INSERT [dbo].[User_Role] ([Id], [Name]) VALUES (2, N'Teacher')
INSERT [dbo].[User_Role] ([Id], [Name]) VALUES (3, N'Student')
SET IDENTITY_INSERT [dbo].[User_Role] OFF
GO
```

---

## Шаг 5: Создание Admin пользователя

После загрузки всех данных создайте Admin через API:

### 5.1 Зарегистрируйте Admin
```bash
POST https://localhost:5001/api/auth/register
Content-Type: application/json

{
  "email": "admin@fitr.com",
  "password": "Admin123!",
  "firstName": "System",
  "lastName": "Administrator",
  "roleName": "Admin"
}
```

### 5.2 Approve Admin вручную
```sql
UPDATE [User] 
SET IsApproved = 1, 
    ApprovedDate = GETDATE(),
    ApprovedBy = (SELECT Id FROM [User] WHERE Email = 'admin@fitr.com')
WHERE Email = 'admin@fitr.com';
```

### 5.3 Login
```bash
POST https://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "admin@fitr.com",
  "password": "Admin123!"
}
```

---

## Итоговая структура данных

После выполнения всех скриптов у вас будет:

| Таблица | Количество записей | Источник |
|---------|-------------------|----------|
| Platform | 4 | script2.sql |
| Node | 17 | script2.sql |
| Pin | 74 | script2.sql |
| Flow | 24 | script1.sql |
| Flow_Node | 452 | script1.sql |
| Alias | ~200+ | script2.sql |
| Connector | ~500+ | script2.sql |
| PinValue | ~1300+ | script2.sql |
| PinValue_Alias | ~80+ | script2.sql |
| User_Role | 3 | 01_Seed_Data_NEW.sql (опционально) |
| User | 1 (admin) | Через API |

---

## Проверка корректности

### 1. Проверьте Platform
```sql
SELECT * FROM Platform;
-- Ожидается: System, Graphics, Test, New
```

### 2. Проверьте Node
```sql
SELECT * FROM Node;
-- Ожидается: Input, Output, String Equals, Not, Debug, Sum, Concat, Multiply и другие
```

### 3. Проверьте Flow
```sql
SELECT * FROM Flow;
-- Ожидается: Задача1, Задача2, ..., Test, New Flow и другие (24 записи)
```

### 4. Проверьте Flow_Node
```sql
SELECT COUNT(*) FROM Flow_Node;
-- Ожидается: 452 записи с координатами X, Y
```

---

## Troubleshooting

### ❌ Ошибка: "Foreign key constraint violation"
**Причина:** Неправильный порядок выполнения скриптов.  
**Решение:** Удалите базу и пересоздайте, выполняя скрипты в правильном порядке (1 → 2 → 3).

### ❌ Ошибка: "Column 'IsPublic' does not exist"
**Причина:** Вы используете старую версию script2.sql.  
**Решение:** Убедитесь что script2.sql был исправлен (поле IsPublic удалено).

### ❌ Ошибка: "Cannot insert explicit value for identity column"
**Причина:** IDENTITY_INSERT не включен.  
**Решение:** Убедитесь что в script1.sql и script2.sql есть:
```sql
SET IDENTITY_INSERT [dbo].[TableName] ON
-- ... INSERT statements ...
SET IDENTITY_INSERT [dbo].[TableName] OFF
```

### ❌ Ошибка: "Invalid object name 'Flow_Node'"
**Причина:** 00_Master_CreateTables.sql не был выполнен.  
**Решение:** Сначала выполните Шаг 1 (создание таблиц).

---

## Полный пример выполнения в SSMS

```sql
-- 1. Создание базы
CREATE DATABASE FITR;
GO
USE FITR;
GO

-- 2. Создание таблиц
:r c:\Other\fitr-master\DB\Database\00_Master_CreateTables.sql

-- 3. Загрузка базовых данных
:r c:\Other\fitr-master\script2.sql

-- 4. Загрузка Flow данных
:r c:\Other\fitr-master\script1.sql

-- 5. (Опционально) Роли
SET IDENTITY_INSERT [dbo].[User_Role] ON 
INSERT [dbo].[User_Role] ([Id], [Name]) VALUES (1, N'Admin')
INSERT [dbo].[User_Role] ([Id], [Name]) VALUES (2, N'Teacher')
INSERT [dbo].[User_Role] ([Id], [Name]) VALUES (3, N'Student')
SET IDENTITY_INSERT [dbo].[User_Role] OFF
GO

-- 6. Проверка
SELECT 'Platforms' AS [Table], COUNT(*) AS [Count] FROM Platform
UNION ALL
SELECT 'Nodes', COUNT(*) FROM Node
UNION ALL
SELECT 'Pins', COUNT(*) FROM Pin
UNION ALL
SELECT 'Flows', COUNT(*) FROM Flow
UNION ALL
SELECT 'Flow_Nodes', COUNT(*) FROM Flow_Node;
```

**Ожидаемый результат:**
```
Table         Count
-----------  -----
Platforms    4
Nodes        17
Pins         74
Flows        24
Flow_Nodes   452
```

---

## Что дальше?

После успешной загрузки всех данных:

1. ✅ Запустите Backend API: `cd API/Server.Api && dotnet run`
2. ✅ Зарегистрируйте Admin через API (см. Шаг 5)
3. ✅ Approve Admin в базе данных
4. ✅ Login как Admin
5. ✅ Запустите UI: `cd UI && npm start`
6. ✅ Откройте Flows в UI - должны увидеть все 24 задачи с правильными координатами нод!

---

**Последнее обновление:** 14 января 2026  
**Версия:** 2.0.0
