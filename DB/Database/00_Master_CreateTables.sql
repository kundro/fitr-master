-- ==================================================
-- FITR Database - Complete Setup Script
-- Run this script on a NEW database to create all tables
-- ==================================================

USE [FITR]
GO

PRINT '==================================================';
PRINT 'FITR Database Setup - Starting';
PRINT 'Date: ' + CONVERT(VARCHAR, GETDATE(), 120);
PRINT '==================================================';
GO

-- ==================================================
-- STEP 1: Create Core Tables
-- ==================================================

PRINT '';
PRINT 'Creating core tables...';
GO

-- Platform
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Platform]'))
BEGIN
    EXEC('
    CREATE TABLE [dbo].[Platform]
    (
        [Id] INT IDENTITY NOT NULL,
        [Name] NVARCHAR(50) NOT NULL,
        [IsActive] BIT DEFAULT 1 NOT NULL,
        [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
        [AddSource] NVARCHAR(50) NOT NULL,
        [ChangeDate] DATETIME,
        [ChangeSource] NVARCHAR(50),
        CONSTRAINT [PK_Platform] PRIMARY KEY ([Id])
    )');
    PRINT 'Platform table created';
END
GO

-- Node
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Node]'))
BEGIN
    EXEC('
    CREATE TABLE [dbo].[Node]
    (
        [Id] INT IDENTITY NOT NULL,
        [PlatformId] INT NOT NULL,
        [Name] NVARCHAR(50) NOT NULL,
        [Command] NVARCHAR(250),
        [CommandType] INT NOT NULL,
        [IsActive] BIT NOT NULL DEFAULT 1,
        [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
        [AddSource] NVARCHAR(50) NOT NULL,
        [ChangeDate] DATETIME,
        [ChangeSource] NVARCHAR(50),
        CONSTRAINT [PK_Node] PRIMARY KEY ([Id])
    )');
    
    ALTER TABLE [Node] ADD CONSTRAINT [FK_Platform_Node] 
        FOREIGN KEY ([PlatformId]) REFERENCES [Platform] ([Id]);
    
    PRINT 'Node table created';
END
GO

-- Pin
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Pin]'))
BEGIN
    EXEC('
    CREATE TABLE [dbo].[Pin]
    (
        [Id] INT IDENTITY NOT NULL,
        [NodeId] INT NOT NULL,
        [Name] NVARCHAR(50) NOT NULL,
        [Direction] INT NOT NULL,
        [ValueType] INT NOT NULL,
        [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
        [AddSource] NVARCHAR(50) NOT NULL,
        [ChangeDate] DATETIME,
        [ChangeSource] NVARCHAR(50),
        CONSTRAINT [PK_Pin] PRIMARY KEY ([Id])
    )');
    
    ALTER TABLE [Pin] ADD CONSTRAINT [FK_Node_Pin] 
        FOREIGN KEY ([NodeId]) REFERENCES [Node] ([Id]);
    
    PRINT 'Pin table created';
END
GO

-- Flow
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Flow]'))
BEGIN
    EXEC('
    CREATE TABLE [dbo].[Flow]
    (
        [Id] INT IDENTITY NOT NULL,
        [Name] NVARCHAR(50) NOT NULL,
        [IsActive] BIT DEFAULT 1 NOT NULL,
        [X] INT DEFAULT 0 NOT NULL,
        [Y] INT DEFAULT 0 NOT NULL,
        [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
        [AddSource] NVARCHAR(50) NOT NULL,
        [ChangeDate] DATETIME,
        [ChangeSource] NVARCHAR(50),
        CONSTRAINT [PK_Flow] PRIMARY KEY ([Id])
    )');
    PRINT 'Flow table created';
END
GO

-- Flow_Node
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Flow_Node]'))
BEGIN
    EXEC('
    CREATE TABLE [dbo].[Flow_Node]
    (
        [Id] INT IDENTITY NOT NULL,
        [NodeId] INT NOT NULL,
        [FlowId] INT NOT NULL,
        [Name] NVARCHAR(50) NOT NULL,
        [X] INT DEFAULT 0 NOT NULL,
        [Y] INT DEFAULT 0 NOT NULL,
        [Color] NVARCHAR(50) NULL,
        [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
        [AddSource] NVARCHAR(50) NOT NULL,
        [ChangeDate] DATETIME,
        [ChangeSource] NVARCHAR(50),
        CONSTRAINT [PK_Flow_Node] PRIMARY KEY ([Id])
    )');
    
    ALTER TABLE [Flow_Node] ADD CONSTRAINT [FK_Flow_Flow_Node] 
        FOREIGN KEY ([FlowId]) REFERENCES [Flow] ([Id]);
    ALTER TABLE [Flow_Node] ADD CONSTRAINT [FK_Node_Flow_Node] 
        FOREIGN KEY ([NodeId]) REFERENCES [Node] ([Id]);
    
    PRINT 'Flow_Node table created';
END
GO

-- PinValue
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PinValue]'))
BEGIN
    EXEC('
    CREATE TABLE [dbo].[PinValue]
    (
        [Id] INT IDENTITY NOT NULL,
        [PinId] INT NOT NULL,
        [FlowNodeId] INT NOT NULL,
        [Value] NVARCHAR(MAX),
        [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
        [AddSource] NVARCHAR(50) NOT NULL,
        [ChangeDate] DATETIME,
        [ChangeSource] NVARCHAR(50),
        CONSTRAINT [PK_PinValue] PRIMARY KEY ([Id])
    )');
    
    ALTER TABLE [PinValue] ADD CONSTRAINT [FK_Pin_PinValue] 
        FOREIGN KEY ([PinId]) REFERENCES [Pin] ([Id]);
    ALTER TABLE [PinValue] ADD CONSTRAINT [FK_FlowNode_PinValue] 
        FOREIGN KEY ([FlowNodeId]) REFERENCES [Flow_Node] ([Id]);
    
    PRINT 'PinValue table created';
END
GO

-- Connector
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Connector]'))
BEGIN
    EXEC('
    CREATE TABLE [dbo].[Connector]
    (
        [Id] INT IDENTITY NOT NULL,
        [FlowId] INT NOT NULL,
        [StartPinValueId] INT NOT NULL,
        [EndPinValueId] INT NOT NULL,
        [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
        [AddSource] NVARCHAR(50) NOT NULL,
        [ChangeDate] DATETIME,
        [ChangeSource] NVARCHAR(50),
        CONSTRAINT [PK_Connector] PRIMARY KEY ([Id])
    )');
    
    ALTER TABLE [Connector] ADD CONSTRAINT [FK_Flow_Connector] 
        FOREIGN KEY ([FlowId]) REFERENCES [Flow] ([Id]);
    
    PRINT 'Connector table created';
END
GO

-- Alias
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Alias]'))
BEGIN
    EXEC('
    CREATE TABLE [dbo].[Alias]
    (
        [Id] INT IDENTITY NOT NULL,
        [FlowId] INT NOT NULL,
        [Name] NVARCHAR(50) NOT NULL,
        [Direction] INT NOT NULL,
        [ValueType] INT NOT NULL,
        [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
        [AddSource] NVARCHAR(50) NOT NULL,
        [ChangeDate] DATETIME,
        [ChangeSource] NVARCHAR(50),
        CONSTRAINT [PK_Alias] PRIMARY KEY ([Id])
    )');
    
    ALTER TABLE [Alias] ADD CONSTRAINT [FK_Flow_Alias] 
        FOREIGN KEY ([FlowId]) REFERENCES [Flow] ([Id]);
    
    PRINT 'Alias table created';
END
GO

-- PinValue_Alias
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PinValue_Alias]'))
BEGIN
    EXEC('
    CREATE TABLE [dbo].[PinValue_Alias]
    (
        [Id] INT IDENTITY NOT NULL,
        [AliasId] INT NOT NULL,
        [PinValueId] INT NOT NULL,
        [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
        [AddSource] NVARCHAR(50) NOT NULL,
        [ChangeDate] DATETIME,
        [ChangeSource] NVARCHAR(50),
        CONSTRAINT [PK_PinValue_Alias] PRIMARY KEY ([Id])
    )');
    
    ALTER TABLE [PinValue_Alias] ADD CONSTRAINT [FK_Alias_PinValue_Alias] 
        FOREIGN KEY ([AliasId]) REFERENCES [Alias] ([Id]);
    ALTER TABLE [PinValue_Alias] ADD CONSTRAINT [FK_PinValue_PinValue_Alias] 
        FOREIGN KEY ([PinValueId]) REFERENCES [PinValue] ([Id]);
    
    PRINT 'PinValue_Alias table created';
END
GO

-- ==================================================
-- STEP 2: Create User & Authentication Tables
-- ==================================================

PRINT '';
PRINT 'Creating user and authentication tables...';
GO

-- User_Role
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Role]'))
BEGIN
    CREATE TABLE [dbo].[User_Role]
    (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Name] NVARCHAR(50) NOT NULL,
        [Description] NVARCHAR(200) NULL,
        [AddDate] DATETIME NOT NULL DEFAULT GETDATE(),
        [AddSource] NVARCHAR(50) NOT NULL DEFAULT 'System',
        [ChangeDate] DATETIME NULL,
        [ChangeSource] NVARCHAR(50) NULL,
        CONSTRAINT [PK_User_Role] PRIMARY KEY ([Id]),
        CONSTRAINT [UQ_User_Role_Name] UNIQUE ([Name])
    );
    PRINT 'User_Role table created';
END
GO

-- User
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User]'))
BEGIN
    CREATE TABLE [dbo].[User]
    (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Email] NVARCHAR(255) NOT NULL,
        [PasswordHash] NVARCHAR(255) NOT NULL,
        [FirstName] NVARCHAR(100) NULL,
        [LastName] NVARCHAR(100) NULL,
        [RoleId] INT NOT NULL,
        [IsApproved] BIT NOT NULL DEFAULT 0,
        [ApprovedBy] INT NULL,
        [ApprovedDate] DATETIME NULL,
        [AddDate] DATETIME NOT NULL DEFAULT GETDATE(),
        [AddSource] NVARCHAR(50) NOT NULL DEFAULT 'System',
        [ChangeDate] DATETIME NULL,
        [ChangeSource] NVARCHAR(50) NULL,
        CONSTRAINT [PK_User] PRIMARY KEY ([Id]),
        CONSTRAINT [UQ_User_Email] UNIQUE ([Email]),
        CONSTRAINT [FK_User_Role] FOREIGN KEY ([RoleId]) REFERENCES [User_Role]([Id]),
        CONSTRAINT [FK_User_ApprovedBy] FOREIGN KEY ([ApprovedBy]) REFERENCES [User]([Id])
    );
    
    CREATE INDEX [IX_User_Role] ON [User]([RoleId]);
    CREATE INDEX [IX_User_IsApproved] ON [User]([IsApproved]);
    
    PRINT 'User table created';
END
GO

-- ==================================================
-- STEP 3: Create Assignment Tables
-- ==================================================

PRINT '';
PRINT 'Creating assignment tables...';
GO

-- Assignment
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Assignment]'))
BEGIN
    CREATE TABLE [dbo].[Assignment]
    (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [TeacherId] INT NOT NULL,
        [FlowId] INT NOT NULL,
        [Title] NVARCHAR(200) NOT NULL,
        [Description] NVARCHAR(MAX) NULL,
        [DueDate] DATETIME NULL,
        [MaxScore] INT NOT NULL DEFAULT 100,
        [IsActive] BIT NOT NULL DEFAULT 1,
        [AddDate] DATETIME NOT NULL DEFAULT GETDATE(),
        [AddSource] NVARCHAR(50) NOT NULL,
        [ChangeDate] DATETIME NULL,
        [ChangeSource] NVARCHAR(50) NULL,
        CONSTRAINT [PK_Assignment] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Assignment_Teacher] FOREIGN KEY ([TeacherId]) REFERENCES [User]([Id]),
        CONSTRAINT [FK_Assignment_Flow] FOREIGN KEY ([FlowId]) REFERENCES [Flow]([Id]) ON DELETE CASCADE
    );
    
    CREATE INDEX [IX_Assignment_Teacher] ON [Assignment]([TeacherId]);
    CREATE INDEX [IX_Assignment_Flow] ON [Assignment]([FlowId]);
    CREATE INDEX [IX_Assignment_IsActive] ON [Assignment]([IsActive]);
    
    PRINT 'Assignment table created';
END
GO

-- Assignment_Submission
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Assignment_Submission]'))
BEGIN
    CREATE TABLE [dbo].[Assignment_Submission]
    (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [AssignmentId] INT NOT NULL,
        [StudentId] INT NOT NULL,
        [FlowData] NVARCHAR(MAX) NULL,
        [Score] INT NULL,
        [Status] NVARCHAR(20) NOT NULL DEFAULT 'Not Started',
        [SubmittedDate] DATETIME NULL,
        [GradedDate] DATETIME NULL,
        [TeacherFeedback] NVARCHAR(MAX) NULL,
        [AddDate] DATETIME NOT NULL DEFAULT GETDATE(),
        [AddSource] NVARCHAR(50) NOT NULL,
        [ChangeDate] DATETIME NULL,
        [ChangeSource] NVARCHAR(50) NULL,
        CONSTRAINT [PK_Assignment_Submission] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Submission_Assignment] FOREIGN KEY ([AssignmentId]) REFERENCES [Assignment]([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Submission_Student] FOREIGN KEY ([StudentId]) REFERENCES [User]([Id]),
        CONSTRAINT [CHK_Submission_Status] CHECK ([Status] IN ('Not Started', 'In Progress', 'Submitted', 'Graded')),
        CONSTRAINT [CHK_Submission_Score] CHECK ([Score] >= 0)
    );
    
    CREATE INDEX [IX_Submission_Assignment] ON [Assignment_Submission]([AssignmentId]);
    CREATE INDEX [IX_Submission_Student] ON [Assignment_Submission]([StudentId]);
    CREATE INDEX [IX_Submission_Status] ON [Assignment_Submission]([Status]);
    CREATE UNIQUE INDEX [UX_Submission_Student_Assignment] ON [Assignment_Submission]([AssignmentId], [StudentId]);
    
    PRINT 'Assignment_Submission table created';
END
GO

PRINT '';
PRINT '==================================================';
PRINT 'FITR Database Setup - Completed Successfully!';
PRINT '==================================================';
GO
