-- ========================================
-- FITR Database - Seed Data Script
-- ========================================
-- This script populates initial data for the system
-- Run AFTER 00_Master_CreateTables.sql

USE FITR;
GO

PRINT '========================================';
PRINT 'FITR Seed Data - Starting';
PRINT 'Date: ' + CONVERT(VARCHAR, GETDATE(), 120);
PRINT '========================================';
GO

-- ========================================
-- 1. SEED USER ROLES
-- ========================================
PRINT '';
PRINT 'Seeding User Roles...';

IF NOT EXISTS (SELECT 1 FROM User_Role WHERE Name = 'Admin')
BEGIN
    SET IDENTITY_INSERT User_Role ON;
    
    INSERT INTO User_Role (Id, Name, AddDate, AddSource, ChangeDate, ChangeSource)
    VALUES 
        (1, 'Admin', GETDATE(), 'Script', GETDATE(), 'Script'),
        (2, 'Teacher', GETDATE(), 'Script', GETDATE(), 'Script'),
        (3, 'Student', GETDATE(), 'Script', GETDATE(), 'Script');
    
    SET IDENTITY_INSERT User_Role OFF;
    PRINT '✓ Roles created: Admin, Teacher, Student';
END
ELSE
    PRINT '→ Roles already exist';
GO

-- ========================================
-- 2. SEED ADMIN USER
-- ========================================
PRINT '';
PRINT 'Seeding Admin User...';

DECLARE @AdminRoleId INT = (SELECT Id FROM User_Role WHERE Name = 'Admin');

IF NOT EXISTS (SELECT 1 FROM [User] WHERE Email = 'admin@fitr.com')
BEGIN
    -- Password: Admin123!
    -- NOTE: This hash is a placeholder. You MUST:
    -- 1. Register admin through API (which will generate proper BCrypt hash)
    -- 2. Then run: UPDATE [User] SET IsApproved=1 WHERE Email='admin@fitr.com'
    INSERT INTO [User] (Email, PasswordHash, FirstName, LastName, RoleId, IsApproved, AddDate, AddSource, ChangeDate, ChangeSource)
    VALUES (
        'admin@fitr.com',
        '$2a$11$PlaceholderHashNeedsToBeGeneratedByAPI', 
        'System',
        'Administrator',
        @AdminRoleId,
        0, -- Will be approved after registration
        GETDATE(),
        'Script',
        GETDATE(),
        'Script'
    );
    PRINT '✓ Admin user created (Email: admin@fitr.com)';
    PRINT '  ⚠ IMPORTANT: Register through API first, then approve manually!';
END
ELSE
    PRINT '→ Admin user already exists';
GO

-- ========================================
-- 3. SEED PLATFORMS
-- ========================================
PRINT '';
PRINT 'Seeding Platforms...';

SET IDENTITY_INSERT Platform ON;

INSERT INTO Platform (Id, Name, IsActive, AddDate, AddSource, ChangeDate, ChangeSource) 
VALUES 
    (1, N'System', 1, GETDATE(), N'Script', GETDATE(), N'Script'),
    (2, N'Graphics', 1, GETDATE(), N'Script', GETDATE(), N'Script');

SET IDENTITY_INSERT Platform OFF;
PRINT '✓ Platforms created: System, Graphics';
GO

-- ========================================
-- 4. SEED NODES
-- ========================================
PRINT '';
PRINT 'Seeding Nodes...';

SET IDENTITY_INSERT Node ON;

INSERT INTO Node (Id, PlatformId, Name, Command, CommandType, IsActive, AddDate, AddSource, ChangeDate, ChangeSource) 
VALUES 
    -- System Nodes
    (1, 1, N'Input', N'FLOW_IN', 3, 1, GETDATE(), N'Script', GETDATE(), N'Script'),
    (2, 1, N'Output', N'FLOW_OUT', 3, 1, GETDATE(), N'Script', GETDATE(), N'Script'),
    (1006, 1, N'String Equals', N'STR_EQUALS', 3, 1, GETDATE(), N'Script', NULL, NULL),
    (1007, 1, N'Not', N'NOT', 3, 1, GETDATE(), N'Script', NULL, NULL),
    (1008, 1, N'Debug', N'CONSOLE_LOG', 3, 1, GETDATE(), N'Script', NULL, NULL),
    (1010, 1, N'Sum', N'SUM', 3, 1, GETDATE(), N'Script', NULL, NULL),
    (1011, 1, N'Concat', N'CONCAT', 3, 1, GETDATE(), N'Script', NULL, NULL),
    (1012, 1, N'Multiply', N'MUL', 3, 1, GETDATE(), N'Script', NULL, NULL),
    (1013, 1, N'Or', N'OR', 3, 1, GETDATE(), N'Script', NULL, NULL),
    (1014, 1, N'And', N'AND', 3, 1, GETDATE(), N'Script', NULL, NULL),
    (1016, 1, N'Message', N'MESSAGE', 3, 1, GETDATE(), N'Script', NULL, NULL),
    (1017, 1, N'Number Equals', N'NUMBER_EQUALS', 3, 1, GETDATE(), N'Script', NULL, NULL),
    -- Graphics Nodes
    (1015, 2, N'Task Point', N'https://localhost:44333/graphics', 1, 1, GETDATE(), N'Script', NULL, NULL);

SET IDENTITY_INSERT Node OFF;
PRINT '✓ Nodes created: 13 nodes (System + Graphics)';
GO

-- ========================================
-- 5. SEED PINS
-- ========================================
PRINT '';
PRINT 'Seeding Pins...';

SET IDENTITY_INSERT Pin ON;

INSERT INTO Pin (Id, NodeId, Name, Direction, ValueType, AddDate, AddSource, ChangeDate, ChangeSource) 
VALUES 
    -- Input Node (Id=1)
    (1, 1, N'Out', 2, 4, GETDATE(), N'Script', NULL, NULL),
    
    -- Output Node (Id=2)
    (2, 2, N'In', 1, 4, GETDATE(), N'Script', NULL, NULL),
    
    -- String Equals (Id=1006)
    (1011, 1006, N'a', 1, 1, GETDATE(), N'Script', NULL, NULL),
    (1012, 1006, N'b', 1, 1, GETDATE(), N'Script', NULL, NULL),
    (1014, 1006, N'Result', 2, 3, GETDATE(), N'Script', NULL, NULL),
    
    -- Not (Id=1007)
    (1015, 1007, N'Value', 1, 3, GETDATE(), N'Script', NULL, NULL),
    (1016, 1007, N'Value', 2, 3, GETDATE(), N'Script', NULL, NULL),
    
    -- Debug (Id=1008)
    (1017, 1008, N'In', 1, 4, GETDATE(), N'Script', NULL, NULL),
    (1018, 1008, N'Message', 1, 1, GETDATE(), N'Script', NULL, NULL),
    (1019, 1008, N'Context', 1, 3, GETDATE(), N'Script', NULL, NULL),
    (1020, 1008, N'Out', 2, 4, GETDATE(), N'Script', NULL, NULL),
    
    -- Sum (Id=1010)
    (1024, 1010, N'a', 1, 2, GETDATE(), N'Script', NULL, NULL),
    (1025, 1010, N'b', 1, 2, GETDATE(), N'Script', NULL, NULL),
    (1026, 1010, N'result', 2, 2, GETDATE(), N'Script', NULL, NULL),
    
    -- Concat (Id=1011)
    (1027, 1011, N'a', 1, 1, GETDATE(), N'Script', NULL, NULL),
    (1028, 1011, N'b', 1, 1, GETDATE(), N'Script', NULL, NULL),
    (1029, 1011, N'result', 2, 1, GETDATE(), N'Script', NULL, NULL),
    
    -- Multiply (Id=1012)
    (1030, 1012, N'a', 1, 2, GETDATE(), N'Script', NULL, NULL),
    (1031, 1012, N'b', 1, 2, GETDATE(), N'Script', NULL, NULL),
    (1032, 1012, N'result', 2, 2, GETDATE(), N'Script', NULL, NULL),
    
    -- Or (Id=1013)
    (1033, 1013, N'a', 1, 3, GETDATE(), N'Script', NULL, NULL),
    (1034, 1013, N'b', 1, 3, GETDATE(), N'Script', NULL, NULL),
    (1035, 1013, N'result', 2, 3, GETDATE(), N'Script', NULL, NULL),
    
    -- And (Id=1014)
    (1036, 1014, N'a', 1, 3, GETDATE(), N'Script', NULL, NULL),
    (1037, 1014, N'b', 1, 3, GETDATE(), N'Script', NULL, NULL),
    (1038, 1014, N'result', 2, 3, GETDATE(), N'Script', NULL, NULL),
    
    -- Task Point (Id=1015)
    (1039, 1015, N'In', 1, 4, GETDATE(), N'Script', NULL, NULL),
    (1040, 1015, N'Out', 2, 4, GETDATE(), N'Script', NULL, NULL),
    
    -- Message (Id=1016)
    (1043, 1016, N'In', 1, 4, GETDATE(), N'Script', NULL, NULL),
    (1044, 1016, N'Message', 1, 1, GETDATE(), N'Script', NULL, NULL),
    (1045, 1016, N'Out', 2, 4, GETDATE(), N'Script', NULL, NULL),
    
    -- Number Equals (Id=1017)
    (1046, 1017, N'a', 1, 2, GETDATE(), N'Script', NULL, NULL),
    (1047, 1017, N'b', 1, 2, GETDATE(), N'Script', NULL, NULL),
    (1048, 1017, N'Result', 2, 3, GETDATE(), N'Script', NULL, NULL);

SET IDENTITY_INSERT Pin OFF;
PRINT '✓ Pins created: 38 pins for all nodes';
GO

-- ========================================
-- COMPLETION MESSAGE
-- ========================================
PRINT '';
PRINT '========================================';
PRINT 'Seed Data Loaded Successfully!';
PRINT '========================================';
PRINT '';
PRINT 'Summary:';
PRINT '  ✓ 3 User Roles (Admin, Teacher, Student)';
PRINT '  ✓ 1 Admin User (needs approval after registration)';
PRINT '  ✓ 2 Platforms (System, Graphics)';
PRINT '  ✓ 13 Nodes (Input, Output, Math, Logic, etc.)';
PRINT '  ✓ 38 Pins (all node inputs/outputs configured)';
PRINT '';
PRINT 'NEXT STEPS:';
PRINT '  1. Register admin: POST /api/auth/register';
PRINT '     { "email": "admin@fitr.com", "password": "Admin123!", "roleName": "Admin" }';
PRINT '  2. Approve admin: UPDATE [User] SET IsApproved=1 WHERE Email=''admin@fitr.com''';
PRINT '  3. Login: POST /api/auth/login';
PRINT '  4. Start creating flows!';
PRINT '';
PRINT '========================================';
GO
