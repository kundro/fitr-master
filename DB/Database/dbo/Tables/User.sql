-- User table: Application users with authentication
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
    CONSTRAINT [FK_User_Role] FOREIGN KEY ([RoleId]) 
        REFERENCES [User_Role]([Id]),
    CONSTRAINT [FK_User_ApprovedBy] FOREIGN KEY ([ApprovedBy]) 
        REFERENCES [User]([Id])
)
GO

CREATE INDEX [IX_User_Role] ON [User]([RoleId])
GO

CREATE INDEX [IX_User_IsApproved] ON [User]([IsApproved])
GO
