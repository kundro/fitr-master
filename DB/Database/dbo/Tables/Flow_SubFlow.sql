-- Create table to store flow groups (subflows added to parent flows)
CREATE TABLE [dbo].[Flow_SubFlow]
(
    [Id] INT IDENTITY NOT NULL,
    [ParentFlowId] INT NOT NULL,
    [SubFlowId] INT NOT NULL,
    [GroupId] UNIQUEIDENTIFIER NOT NULL,
    [GroupName] NVARCHAR(255) NOT NULL,
    [IsCollapsed] BIT DEFAULT 0 NOT NULL,
    [PositionX] FLOAT DEFAULT 0 NOT NULL,
    [PositionY] FLOAT DEFAULT 0 NOT NULL,
    
    [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
    [AddSource] NVARCHAR(50) NOT NULL,
    [ChangeDate] DATETIME,
    [ChangeSource] NVARCHAR(50),

    CONSTRAINT [PK_Flow_SubFlow] PRIMARY KEY ([Id])
)
GO

-- Foreign key constraints
ALTER TABLE [Flow_SubFlow] ADD CONSTRAINT [FK_ParentFlow_Flow_SubFlow] 
    FOREIGN KEY ([ParentFlowId]) REFERENCES [Flow] ([Id]) ON DELETE CASCADE
GO

ALTER TABLE [Flow_SubFlow] ADD CONSTRAINT [FK_SubFlow_Flow_SubFlow]
    FOREIGN KEY ([SubFlowId]) REFERENCES [Flow] ([Id])
GO

-- Update Flow_Node table to track which flow group it belongs to
ALTER TABLE [Flow_Node] 
ADD [FlowSubFlowId] INT NULL
GO

ALTER TABLE [Flow_Node] ADD CONSTRAINT [FK_FlowNode_FlowSubFlow]
    FOREIGN KEY ([FlowSubFlowId]) REFERENCES [Flow_SubFlow] ([Id]) ON DELETE SET NULL
GO

-- Index for better performance
CREATE INDEX [IX_Flow_SubFlow_ParentFlowId] ON [Flow_SubFlow] ([ParentFlowId])
GO

CREATE INDEX [IX_Flow_SubFlow_GroupId] ON [Flow_SubFlow] ([GroupId])
GO