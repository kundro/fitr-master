SET NOCOUNT ON
SET IDENTITY_INSERT [node] ON

MERGE INTO [node] AS [Target]
USING (VALUES
  (1,1,N'Input',NULL,3,1,GETDATE(),N'script',NULL,NULL)
 ,(2,1,N'Output',NULL,3,1,GETDATE(),N'script',NULL,NULL)
) AS [Source] ([Id],[PlatformId],[Name],[Command],[CommandType],[IsActive],[AddDate],[AddSource],[ChangeDate],[ChangeSource])
ON ([Target].[Id] = [Source].[Id])
WHEN MATCHED AND (
	NULLIF([Source].[PlatformId], [Target].[PlatformId]) IS NOT NULL OR NULLIF([Target].[PlatformId], [Source].[PlatformId]) IS NOT NULL OR 
	NULLIF([Source].[Name], [Target].[Name]) IS NOT NULL OR NULLIF([Target].[Name], [Source].[Name]) IS NOT NULL OR 
	NULLIF([Source].[Command], [Target].[Command]) IS NOT NULL OR NULLIF([Target].[Command], [Source].[Command]) IS NOT NULL OR 
	NULLIF([Source].[CommandType], [Target].[CommandType]) IS NOT NULL OR NULLIF([Target].[CommandType], [Source].[CommandType]) IS NOT NULL OR 
	NULLIF([Source].[IsActive], [Target].[IsActive]) IS NOT NULL OR NULLIF([Target].[IsActive], [Source].[IsActive]) IS NOT NULL OR 
	NULLIF([Source].[AddDate], [Target].[AddDate]) IS NOT NULL OR NULLIF([Target].[AddDate], [Source].[AddDate]) IS NOT NULL OR 
	NULLIF([Source].[AddSource], [Target].[AddSource]) IS NOT NULL OR NULLIF([Target].[AddSource], [Source].[AddSource]) IS NOT NULL OR 
	NULLIF([Source].[ChangeDate], [Target].[ChangeDate]) IS NOT NULL OR NULLIF([Target].[ChangeDate], [Source].[ChangeDate]) IS NOT NULL OR 
	NULLIF([Source].[ChangeSource], [Target].[ChangeSource]) IS NOT NULL OR NULLIF([Target].[ChangeSource], [Source].[ChangeSource]) IS NOT NULL) THEN
 UPDATE SET
  [Target].[PlatformId] = [Source].[PlatformId], 
  [Target].[Name] = [Source].[Name], 
  [Target].[Command] = [Source].[Command], 
  [Target].[CommandType] = [Source].[CommandType],  
  [Target].[IsActive] = [Source].[IsActive], 
  [Target].[AddDate] = [Source].[AddDate], 
  [Target].[AddSource] = [Source].[AddSource], 
  [Target].[ChangeDate] = [Source].[ChangeDate], 
  [Target].[ChangeSource] = [Source].[ChangeSource]
WHEN NOT MATCHED BY TARGET THEN
 INSERT([Id],[PlatformId],[Name],[Command],[CommandType],[IsActive],[AddDate],[AddSource],[ChangeDate],[ChangeSource])
 VALUES([Source].[Id],[Source].[PlatformId],[Source].[Name],[Source].[Command],[Source].[CommandType],[Source].[IsActive],[Source].[AddDate],[Source].[AddSource],[Source].[ChangeDate],[Source].[ChangeSource])
;

DECLARE @mergeError int
 , @mergeCount int
SELECT @mergeError = @@ERROR, @mergeCount = @@ROWCOUNT
IF @mergeError != 0
 BEGIN
 PRINT 'ERROR OCCURRED IN MERGE FOR [node]. Rows affected: ' + CAST(@mergeCount AS VARCHAR(100)); -- SQL should always return zero rows affected
 END
ELSE
 BEGIN
 PRINT '[node] rows affected by MERGE: ' + CAST(@mergeCount AS VARCHAR(100));
 END
GO

SET IDENTITY_INSERT [node] OFF
SET NOCOUNT OFF
GO