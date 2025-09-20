-- Fix Description column size issue
-- This script increases the Description column size from 500 to 2000 characters
-- to accommodate longer company descriptions from Financial Modeling Prep API

USE TVA;
GO

-- Check if table exists
IF EXISTS (SELECT * FROM sysobjects WHERE name='TrackedSymbols' AND xtype='U')
BEGIN
    PRINT 'Altering Description column size from 500 to 4000 characters...'

    -- Alter the Description column to allow longer text
    ALTER TABLE [dbo].[TrackedSymbols]
    ALTER COLUMN [Description] [nvarchar](4000) NULL;

    PRINT 'Description column size updated successfully!'
END
ELSE
BEGIN
    PRINT 'TrackedSymbols table not found!'
END
GO