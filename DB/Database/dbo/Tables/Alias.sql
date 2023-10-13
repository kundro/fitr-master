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
)
GO

ALTER TABLE [Alias] ADD CONSTRAINT [FK_Flow_Alias] 
    FOREIGN KEY ([FlowId]) REFERENCES [Flow] ([Id]) 
GO