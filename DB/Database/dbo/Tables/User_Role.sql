-- User_Role table: Roles in the system (Admin, Teacher, Student)
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
)
GO
