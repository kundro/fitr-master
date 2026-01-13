-- ================================================
-- ADD AUTHENTICATION TABLES TO EXISTING DATABASE
-- ================================================
-- Run this script AFTER script2.sql to add auth functionality
-- ================================================

USE [Splate]
GO

-- ================================================
-- 1. Create User_Role table
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'User_Role')
BEGIN
    CREATE TABLE [dbo].[User_Role] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Name] NVARCHAR(50) NOT NULL,
        
        [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
        [AddSource] NVARCHAR(50) NOT NULL DEFAULT '',
        [ChangeDate] DATETIME NULL,
        [ChangeSource] NVARCHAR(50) NULL,
        
        CONSTRAINT [PK_User_Role] PRIMARY KEY ([Id])
    );
    
    PRINT '✓ User_Role table created';
END
ELSE
    PRINT '- User_Role table already exists';
GO

-- ================================================
-- 2. Create User table
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'User')
BEGIN
    CREATE TABLE [dbo].[User] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Email] NVARCHAR(255) NOT NULL,
        [PasswordHash] NVARCHAR(255) NOT NULL,
        [FirstName] NVARCHAR(100) NOT NULL,
        [LastName] NVARCHAR(100) NOT NULL,
        [RoleId] INT NOT NULL,
        [IsApproved] BIT NOT NULL DEFAULT 0,
        
        [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
        [AddSource] NVARCHAR(50) NOT NULL DEFAULT '',
        [ChangeDate] DATETIME NULL,
        [ChangeSource] NVARCHAR(50) NULL,
        
        CONSTRAINT [PK_User] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_User_Role] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[User_Role]([Id]),
        CONSTRAINT [UQ_User_Email] UNIQUE ([Email])
    );
    
    PRINT '✓ User table created';
END
ELSE
    PRINT '- User table already exists';
GO

-- ================================================
-- 3. Create Assignment table
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Assignment')
BEGIN
    CREATE TABLE [dbo].[Assignment] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Title] NVARCHAR(200) NOT NULL,
        [Description] NVARCHAR(MAX) NULL,
        [TeacherId] INT NOT NULL,
        [FlowId] INT NOT NULL,
        [DueDate] DATETIME NOT NULL,
        
        [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
        [AddSource] NVARCHAR(50) NOT NULL DEFAULT '',
        [ChangeDate] DATETIME NULL,
        [ChangeSource] NVARCHAR(50) NULL,
        
        CONSTRAINT [PK_Assignment] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Assignment_Teacher] FOREIGN KEY ([TeacherId]) REFERENCES [dbo].[User]([Id]),
        CONSTRAINT [FK_Assignment_Flow] FOREIGN KEY ([FlowId]) REFERENCES [dbo].[Flow]([Id])
    );
    
    PRINT '✓ Assignment table created';
END
ELSE
    PRINT '- Assignment table already exists';
GO

-- ================================================
-- 4. Create Assignment_Submission table
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Assignment_Submission')
BEGIN
    CREATE TABLE [dbo].[Assignment_Submission] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [AssignmentId] INT NOT NULL,
        [StudentId] INT NOT NULL,
        [SubmittedFlowId] INT NULL,
        [Comments] NVARCHAR(MAX) NULL,
        [Score] DECIMAL(5,2) NULL,
        [Feedback] NVARCHAR(MAX) NULL,
        [SubmittedAt] DATETIME NOT NULL,
        
        [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
        [AddSource] NVARCHAR(50) NOT NULL DEFAULT '',
        [ChangeDate] DATETIME NULL,
        [ChangeSource] NVARCHAR(50) NULL,
        
        CONSTRAINT [PK_Assignment_Submission] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Submission_Assignment] FOREIGN KEY ([AssignmentId]) REFERENCES [dbo].[Assignment]([Id]),
        CONSTRAINT [FK_Submission_Student] FOREIGN KEY ([StudentId]) REFERENCES [dbo].[User]([Id]),
        CONSTRAINT [FK_Submission_Flow] FOREIGN KEY ([SubmittedFlowId]) REFERENCES [dbo].[Flow]([Id])
    );
    
    PRINT '✓ Assignment_Submission table created';
END
ELSE
    PRINT '- Assignment_Submission table already exists';
GO

-- ================================================
-- 5. Seed User Roles
-- ================================================
IF NOT EXISTS (SELECT * FROM [dbo].[User_Role] WHERE [Name] = 'Admin')
BEGIN
    SET IDENTITY_INSERT [dbo].[User_Role] ON;
    
    INSERT INTO [dbo].[User_Role] ([Id], [Name], [AddSource]) 
    VALUES 
        (1, 'Admin', 'Script'),
        (2, 'Teacher', 'Script'),
        (3, 'Student', 'Script');
    
    SET IDENTITY_INSERT [dbo].[User_Role] OFF;
    
    PRINT '✓ User roles seeded (Admin, Teacher, Student)';
END
ELSE
    PRINT '- User roles already exist';
GO

-- ================================================
-- 6. Create default Admin user
-- ================================================
-- TEMPORARY Password: admin123
-- This will be updated with proper BCrypt hash after first API run
IF NOT EXISTS (SELECT * FROM [dbo].[User] WHERE [Email] = 'admin@fitr.local')
BEGIN
    INSERT INTO [dbo].[User] 
        ([Email], [PasswordHash], [FirstName], [LastName], [RoleId], [IsApproved], [AddSource])
    VALUES 
        ('admin@fitr.local', 
         'TEMPORARY_HASH_UPDATE_VIA_API', 
         'System', 
         'Administrator', 
         1, 
         1, 
         'Script');
    
    PRINT '✓ Default admin user created (use API to set password)';
    PRINT '  Email: admin@fitr.local';
    PRINT '';
    PRINT '⚠️  IMPORTANT: Run POST /api/auth/init-admin to set admin password!';
END
ELSE
    PRINT '- Admin user already exists';
GO

PRINT '';
PRINT '================================================';
PRINT 'Authentication tables setup complete!';
PRINT '================================================';
PRINT '';
PRINT 'Next steps:';
PRINT '1. Login as admin (admin@fitr.local / admin123)';
PRINT '2. Change admin password';
PRINT '3. Users can register as Teacher or Student';
PRINT '4. Admin approves Teachers';
PRINT '5. Teachers approve Students';
PRINT '================================================';
GO
