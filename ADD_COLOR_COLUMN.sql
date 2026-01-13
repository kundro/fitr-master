-- ================================================
-- ADD COLOR COLUMN TO FLOW_NODE TABLE
-- ================================================
-- Run this script on your existing Splate database
-- to add Color support for nodes from subflows
-- ================================================

USE [Splate]
GO

-- Check if Color column already exists
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Flow_Node]') 
    AND name = 'Color'
)
BEGIN
    ALTER TABLE [dbo].[Flow_Node]
    ADD [Color] NVARCHAR(50) NULL;
    
    PRINT 'Color column added to Flow_Node table successfully!';
END
ELSE
BEGIN
    PRINT 'Color column already exists in Flow_Node table.';
END
GO
