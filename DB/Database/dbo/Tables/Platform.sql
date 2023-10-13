CREATE TABLE [dbo].[Platform]
(
	[Id] INT IDENTITY NOT NULL,
    [Name] NVARCHAR(50) NOT NULL, 
    [Description] NVARCHAR(250) NULL, 
    [Author] NVARCHAR(50) NOT NULL,
    [IsActive] BIT NOT NULL DEFAULT 1, 

    [AddDate] DATETIME DEFAULT GETDATE() NOT NULL,
    [AddSource] NVARCHAR(50) NOT NULL,
    [ChangeDate] DATETIME,
    [ChangeSource] NVARCHAR(50),

    CONSTRAINT [PK_Platform] PRIMARY KEY ([Id])
)