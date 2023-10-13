CREATE TABLE [dbo].[Flow_Node]
(
	[Id] INT IDENTITY NOT NULL,
    [NodeId] INT NOT NULL,
    [FlowId] INT NOT NULL,
    [Name] NVARCHAR(50) NOT NULL, 
    [X] INT DEFAULT 0 NOT NULL,
    [Y] INT DEFAULT 0 NOT NULL,

    [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
    [AddSource] NVARCHAR(50) NOT NULL,
    [ChangeDate] DATETIME,
    [ChangeSource] NVARCHAR(50),

    CONSTRAINT [PK_Flow_Node] PRIMARY KEY ([Id])
)
GO

ALTER TABLE [Flow_Node] ADD CONSTRAINT [FK_Flow_Flow_Node] 
    FOREIGN KEY ([FlowId]) REFERENCES [Flow] ([Id]) 
GO

ALTER TABLE [Flow_Node] ADD CONSTRAINT [FK_Node_Flow_Node] 
    FOREIGN KEY ([NodeId]) REFERENCES [Node] ([Id]) 
GO