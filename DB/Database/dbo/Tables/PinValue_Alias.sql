CREATE TABLE [dbo].[PinValue_Alias]
(
	[Id] INT IDENTITY NOT NULL,
    [AliasId] INT NOT NULL,
    [PinValueId] INT NOT NULL,

    [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
    [AddSource] NVARCHAR(50) NOT NULL,
    [ChangeDate] DATETIME,
    [ChangeSource] NVARCHAR(50)

    CONSTRAINT [PK_PinValue_Alias] PRIMARY KEY ([Id])
)
GO

ALTER TABLE [PinValue_Alias] ADD CONSTRAINT [FK_Alias_PinValueAlias] 
    FOREIGN KEY ([AliasId]) REFERENCES [Alias] ([Id]) 
GO

ALTER TABLE [PinValue_Alias] ADD CONSTRAINT [FK_PinValue_PinValueAlias] 
    FOREIGN KEY ([PinValueId]) REFERENCES [PinValue] ([Id]) 
GO
