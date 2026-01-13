-- Assignment table: Tasks created by teachers for students
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
    CONSTRAINT [FK_Assignment_Teacher] FOREIGN KEY ([TeacherId]) 
        REFERENCES [User]([Id]),
    CONSTRAINT [FK_Assignment_Flow] FOREIGN KEY ([FlowId]) 
        REFERENCES [Flow]([Id]) ON DELETE CASCADE
)
GO

CREATE INDEX [IX_Assignment_Teacher] ON [Assignment]([TeacherId])
GO

CREATE INDEX [IX_Assignment_Flow] ON [Assignment]([FlowId])
GO

CREATE INDEX [IX_Assignment_IsActive] ON [Assignment]([IsActive])
GO
