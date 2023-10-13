CREATE TABLE [dbo].[PinValue]
(
	[Id] INT IDENTITY NOT NULL,
    [PinId] INT NOT NULL,
    [FlowNodeId] INT NOT NULL,
    [Value] NVARCHAR(250) NOT NULL, 

    [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
    [AddSource] NVARCHAR(50) NOT NULL,
    [ChangeDate] DATETIME,
    [ChangeSource] NVARCHAR(50)

    CONSTRAINT [PK_PinValue] PRIMARY KEY ([Id])
)
GO

ALTER TABLE [PinValue] ADD CONSTRAINT [FK_Pin_PinValue] 
    FOREIGN KEY ([PinId]) REFERENCES [Pin] ([Id]) 
GO

ALTER TABLE [PinValue] ADD CONSTRAINT [FK_Pin_Flow_Node] 
    FOREIGN KEY ([FlowNodeId]) REFERENCES [Flow_Node] ([Id]) 
GO