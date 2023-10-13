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
)
GO

ALTER TABLE [Node] ADD CONSTRAINT [FK_Platform_Node] 
    FOREIGN KEY ([PlatformId]) REFERENCES [Platform] ([Id]) 
GO