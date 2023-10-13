CREATE TABLE [dbo].[Pin]
(
	[Id] INT IDENTITY NOT NULL,
    [NodeId] INT NOT NULL,
    [Name] NVARCHAR(50) NOT NULL, 
    [Direction] INT NOT NULL,
    [ValueType] INT NOT NULL,
    [IsPublic] BIT NOT NULL,

    [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
    [AddSource] NVARCHAR(50) NOT NULL,
    [ChangeDate] DATETIME,
    [ChangeSource] NVARCHAR(50),

    CONSTRAINT [PK_Pin] PRIMARY KEY ([Id])
)
GO

ALTER TABLE [Pin] ADD CONSTRAINT [FK_Node_Pin] 
    FOREIGN KEY ([NodeId]) REFERENCES [Node] ([Id]) 
GO