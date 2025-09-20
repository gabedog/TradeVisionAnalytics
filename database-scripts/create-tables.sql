-- Trading Vision Analytics Database Tables
-- Based on C# POCOs

USE TVA;
GO

-- Create Quotes table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Quotes' AND xtype='U')
BEGIN
    CREATE TABLE Quotes (
        Id int IDENTITY(1,1) NOT NULL,
        Symbol nvarchar(10) NOT NULL,
        Name nvarchar(100) NOT NULL,
        Price decimal(18,4) NOT NULL,
        Change decimal(18,4) NOT NULL,
        ChangePercent decimal(8,4) NOT NULL,
        Volume bigint NOT NULL,
        MarketCap decimal(20,2) NULL,
        AvgPrice50Day decimal(18,4) NULL,
        Exchange nvarchar(20) NULL,
        LastUpdated datetime2(7) NOT NULL,
        CreatedAt datetime2(7) NOT NULL,
        CONSTRAINT PK_Quotes PRIMARY KEY (Id)
    );

    -- Create unique index on Symbol
    CREATE UNIQUE INDEX IX_Quotes_Symbol ON Quotes (Symbol);

    -- Create index on LastUpdated for efficient queries
    CREATE INDEX IX_Quotes_LastUpdated ON Quotes (LastUpdated);
END
GO

-- Create DailyQuotes table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DailyQuotes' AND xtype='U')
BEGIN
    CREATE TABLE DailyQuotes (
        Id int IDENTITY(1,1) NOT NULL,
        Symbol nvarchar(10) NOT NULL,
        [Date] datetime2(7) NOT NULL,
        [Open] decimal(18,4) NOT NULL,
        [High] decimal(18,4) NOT NULL,
        [Low] decimal(18,4) NOT NULL,
        [Close] decimal(18,4) NOT NULL,
        Volume bigint NOT NULL,
        CreatedAt datetime2(7) NOT NULL,
        CONSTRAINT PK_DailyQuotes PRIMARY KEY (Id)
    );

    -- Create unique index on Symbol and Date combination
    CREATE UNIQUE INDEX IX_DailyQuotes_Symbol_Date ON DailyQuotes (Symbol, [Date]);

    -- Create index on Date for efficient date range queries
    CREATE INDEX IX_DailyQuotes_Date ON DailyQuotes ([Date]);

    -- Create index on Symbol for efficient symbol-based queries
    CREATE INDEX IX_DailyQuotes_Symbol ON DailyQuotes (Symbol);
END
GO

-- Insert META seed data
-- Current quote data (using latest from historical data)
IF NOT EXISTS (SELECT * FROM Quotes WHERE Symbol = 'META')
BEGIN
    INSERT INTO Quotes (Symbol, Name, Price, Change, ChangePercent, Volume, MarketCap, AvgPrice50Day, Exchange, LastUpdated, CreatedAt)
    VALUES ('META', 'Meta Platforms, Inc.', 775.72, -3.29, -0.42, 9307917, 1950000000000, 743.56, 'NASDAQ', '2025-09-17 00:00:00', GETUTCDATE());
END
GO

-- Insert META daily quotes from FMP API (past week)
IF NOT EXISTS (SELECT * FROM DailyQuotes WHERE Symbol = 'META' AND [Date] = '2025-09-17')
BEGIN
    INSERT INTO DailyQuotes (Symbol, [Date], [Open], [High], [Low], [Close], Volume, CreatedAt) VALUES
    ('META', '2025-09-17', 779.99, 783.29, 766.31, 775.72, 9307917, GETUTCDATE()),
    ('META', '2025-09-16', 767.00, 781.36, 765.10, 779.00, 11782500, GETUTCDATE()),
    ('META', '2025-09-15', 757.47, 774.07, 751.99, 764.70, 10533800, GETUTCDATE()),
    ('META', '2025-09-12', 748.73, 757.57, 743.76, 755.59, 8248600, GETUTCDATE()),
    ('META', '2025-09-11', 754.65, 757.10, 748.37, 750.90, 7923300, GETUTCDATE()),
    ('META', '2025-09-10', 765.13, 765.70, 751.00, 751.98, 12478300, GETUTCDATE());
END
GO

PRINT 'Tables created successfully with META seed data.';