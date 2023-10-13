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

    CONSTRAINT [PK_PinValue_Connector] PRIMARY KEY ([Id])
)
GO

ALTER TABLE [Connector] ADD CONSTRAINT [FK_Flow_Connector] 
    FOREIGN KEY ([FlowId]) REFERENCES [Flow] ([Id]) 
GO

ALTER TABLE [Connector] ADD CONSTRAINT [FK_PinValue_Connector_Start] 
    FOREIGN KEY ([StartPinValueId]) REFERENCES [PinValue] ([Id]) 
GO

ALTER TABLE [Connector] ADD CONSTRAINT [FK_PinValue_Connector_End] 
    FOREIGN KEY ([EndPinValueId]) REFERENCES [PinValue] ([Id]) 
GO