SET NOCOUNT ON
SET IDENTITY_INSERT [Platform] ON

MERGE INTO [Platform] AS [Target]
USING (VALUES
  (1,N'System',N'System nodes',N'System',1,GETDATE(),N'script',NULL,NULL)
) AS [Source] ([Id],[Name],[Description],[Author],[IsActive],[AddDate],[AddSource],[ChangeDate],[ChangeSource])
ON ([Target].[Id] = [Source].[Id])
WHEN MATCHED AND (
	NULLIF([Source].[Name], [Target].[Name]) IS NOT NULL OR NULLIF([Target].[Name], [Source].[Name]) IS NOT NULL OR 
	NULLIF([Source].[Description], [Target].[Description]) IS NOT NULL OR NULLIF([Target].[Description], [Source].[Description]) IS NOT NULL OR 
	NULLIF([Source].[Author], [Target].[Author]) IS NOT NULL OR NULLIF([Target].[Author], [Source].[Author]) IS NOT NULL OR 
	NULLIF([Source].[IsActive], [Target].[IsActive]) IS NOT NULL OR NULLIF([Target].[IsActive], [Source].[IsActive]) IS NOT NULL OR 
	NULLIF([Source].[AddDate], [Target].[AddDate]) IS NOT NULL OR NULLIF([Target].[AddDate], [Source].[AddDate]) IS NOT NULL OR 
	NULLIF([Source].[AddSource], [Target].[AddSource]) IS NOT NULL OR NULLIF([Target].[AddSource], [Source].[AddSource]) IS NOT NULL OR 
	NULLIF([Source].[ChangeDate], [Target].[ChangeDate]) IS NOT NULL OR NULLIF([Target].[ChangeDate], [Source].[ChangeDate]) IS NOT NULL OR 
	NULLIF([Source].[ChangeSource], [Target].[ChangeSource]) IS NOT NULL OR NULLIF([Target].[ChangeSource], [Source].[ChangeSource]) IS NOT NULL) THEN
 UPDATE SET
  [Target].[Name] = [Source].[Name], 
  [Target].[Description] = [Source].[Description], 
  [Target].[Author] = [Source].[Author], 
  [Target].[IsActive] = [Source].[IsActive], 
  [Target].[AddDate] = [Source].[AddDate], 
  [Target].[AddSource] = [Source].[AddSource], 
  [Target].[ChangeDate] = [Source].[ChangeDate], 
  [Target].[ChangeSource] = [Source].[ChangeSource]
WHEN NOT MATCHED BY TARGET THEN
 INSERT([Id],[Name],[Description],[Author],[IsActive],[AddDate],[AddSource],[ChangeDate],[ChangeSource])
 VALUES([Source].[Id],[Source].[Name],[Source].[Description],[Source].[Author],[Source].[IsActive],[Source].[AddDate],[Source].[AddSource],[Source].[ChangeDate],[Source].[ChangeSource])
;

DECLARE @mergeError int
 , @mergeCount int
SELECT @mergeError = @@ERROR, @mergeCount = @@ROWCOUNT
IF @mergeError != 0
 BEGIN
 PRINT 'ERROR OCCURRED IN MERGE FOR [Platform]. Rows affected: ' + CAST(@mergeCount AS VARCHAR(100)); -- SQL should always return zero rows affected
 END
ELSE
 BEGIN
 PRINT '[Platform] rows affected by MERGE: ' + CAST(@mergeCount AS VARCHAR(100));
 END
GO

SET IDENTITY_INSERT [Platform] OFF
SET NOCOUNT OFF
GO