SET NOCOUNT ON
SET IDENTITY_INSERT [pin] ON

MERGE INTO [pin] AS [Target]
USING (VALUES
  (1,1,N'',2,4,1,GETDATE(),N'script',NULL,NULL)
 ,(2,2,N'',1,4,1,GETDATE(),N'script',NULL,NULL)
) AS [Source] ([Id],[NodeId],[Name],[Direction],[ValueType],[IsPublic],[AddDate],[AddSource],[ChangeDate],[ChangeSource])
ON ([Target].[Id] = [Source].[Id])
WHEN MATCHED AND (
	NULLIF([Source].[NodeId], [Target].[NodeId]) IS NOT NULL OR NULLIF([Target].[NodeId], [Source].[NodeId]) IS NOT NULL OR 
	NULLIF([Source].[Name], [Target].[Name]) IS NOT NULL OR NULLIF([Target].[Name], [Source].[Name]) IS NOT NULL OR 
	NULLIF([Source].[Direction], [Target].[Direction]) IS NOT NULL OR NULLIF([Target].[Direction], [Source].[Direction]) IS NOT NULL OR 
	NULLIF([Source].[ValueType], [Target].[ValueType]) IS NOT NULL OR NULLIF([Target].[ValueType], [Source].[ValueType]) IS NOT NULL OR 
	NULLIF([Source].[IsPublic], [Target].[IsPublic]) IS NOT NULL OR NULLIF([Target].[IsPublic], [Source].[IsPublic]) IS NOT NULL OR 
	NULLIF([Source].[AddDate], [Target].[AddDate]) IS NOT NULL OR NULLIF([Target].[AddDate], [Source].[AddDate]) IS NOT NULL OR 
	NULLIF([Source].[AddSource], [Target].[AddSource]) IS NOT NULL OR NULLIF([Target].[AddSource], [Source].[AddSource]) IS NOT NULL OR 
	NULLIF([Source].[ChangeDate], [Target].[ChangeDate]) IS NOT NULL OR NULLIF([Target].[ChangeDate], [Source].[ChangeDate]) IS NOT NULL OR 
	NULLIF([Source].[ChangeSource], [Target].[ChangeSource]) IS NOT NULL OR NULLIF([Target].[ChangeSource], [Source].[ChangeSource]) IS NOT NULL) THEN
 UPDATE SET
  [Target].[NodeId] = [Source].[NodeId], 
  [Target].[Name] = [Source].[Name],  
  [Target].[Direction] = [Source].[Direction],
  [Target].[ValueType] = [Source].[ValueType], 
  [Target].[AddDate] = [Source].[AddDate], 
  [Target].[AddSource] = [Source].[AddSource], 
  [Target].[ChangeDate] = [Source].[ChangeDate], 
  [Target].[ChangeSource] = [Source].[ChangeSource],
  [Target].[IsPublic] = [Source].[IsPublic]
WHEN NOT MATCHED BY TARGET THEN
 INSERT([Id],[NodeId],[Name],[Direction],[ValueType],[IsPublic],[AddDate],[AddSource],[ChangeDate],[ChangeSource])
 VALUES([Source].[Id],[Source].[NodeId],[Source].[Name],[Source].[Direction],[Source].[ValueType],[Source].[IsPublic],[Source].[AddDate],[Source].[AddSource],[Source].[ChangeDate],[Source].[ChangeSource])
;

DECLARE @mergeError int
 , @mergeCount int
SELECT @mergeError = @@ERROR, @mergeCount = @@ROWCOUNT
IF @mergeError != 0
 BEGIN
 PRINT 'ERROR OCCURRED IN MERGE FOR [pin]. Rows affected: ' + CAST(@mergeCount AS VARCHAR(100)); -- SQL should always return zero rows affected
 END
ELSE
 BEGIN
 PRINT '[pin] rows affected by MERGE: ' + CAST(@mergeCount AS VARCHAR(100));
 END
GO

SET IDENTITY_INSERT [pin] OFF
SET NOCOUNT OFF
GO