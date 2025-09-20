-- Trading Vision Analytics Database Schema
-- Run this script to create the necessary tables

USE TVA;
GO

-- Create TrackedSymbols table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TrackedSymbols' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[TrackedSymbols](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Symbol] [nvarchar](10) NOT NULL,
        [Name] [nvarchar](200) NOT NULL,
        [Type] [nvarchar](50) NOT NULL,
        [AddedDate] [datetime2](7) NOT NULL,
        [LastUpdated] [datetime2](7) NULL,
        [Status] [nvarchar](20) NOT NULL,
        [HistoricalDataStart] [datetime2](7) NOT NULL,
        [HistoricalDataEnd] [datetime2](7) NULL,
        [DataPoints] [int] NOT NULL,
        [Description] [nvarchar](500) NULL,
        [Sector] [nvarchar](100) NULL,
        [Industry] [nvarchar](100) NULL,
        CONSTRAINT [PK_TrackedSymbols] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
    
    CREATE UNIQUE NONCLUSTERED INDEX [IX_TrackedSymbols_Symbol] ON [dbo].[TrackedSymbols] ([Symbol] ASC);
END
GO

-- Create DailyQuotes table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DailyQuotes' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[DailyQuotes](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [TrackedSymbolId] [int] NOT NULL,
        [Date] [datetime2](7) NOT NULL,
        [Open] [decimal](18, 4) NOT NULL,
        [High] [decimal](18, 4) NOT NULL,
        [Low] [decimal](18, 4) NOT NULL,
        [Close] [decimal](18, 4) NOT NULL,
        [Volume] [bigint] NOT NULL,
        [AdjustedClose] [decimal](18, 4) NULL,
        [Change] [decimal](18, 4) NULL,
        [ChangePercent] [decimal](18, 4) NULL,
        [CreatedAt] [datetime2](7) NOT NULL,
        CONSTRAINT [PK_DailyQuotes] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
    
    CREATE UNIQUE NONCLUSTERED INDEX [IX_DailyQuotes_TrackedSymbolId_Date] ON [dbo].[DailyQuotes] ([TrackedSymbolId] ASC, [Date] ASC);
    
    ALTER TABLE [dbo].[DailyQuotes] WITH CHECK ADD CONSTRAINT [FK_DailyQuotes_TrackedSymbols_TrackedSymbolId] 
        FOREIGN KEY([TrackedSymbolId]) REFERENCES [dbo].[TrackedSymbols] ([Id]) ON DELETE CASCADE;
END
GO

-- Create ETFHoldings table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ETFHoldings' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[ETFHoldings](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [ETFSymbolId] [int] NOT NULL,
        [HoldingSymbolId] [int] NOT NULL,
        [Weight] [decimal](18, 6) NOT NULL,
        [Shares] [bigint] NOT NULL,
        [MarketValue] [decimal](18, 2) NULL,
        [IsTracked] [bit] NOT NULL,
        [LastUpdated] [datetime2](7) NOT NULL,
        CONSTRAINT [PK_ETFHoldings] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
    
    CREATE UNIQUE NONCLUSTERED INDEX [IX_ETFHoldings_ETFSymbolId_HoldingSymbolId] ON [dbo].[ETFHoldings] ([ETFSymbolId] ASC, [HoldingSymbolId] ASC);
    
    ALTER TABLE [dbo].[ETFHoldings] WITH CHECK ADD CONSTRAINT [FK_ETFHoldings_TrackedSymbols_ETFSymbolId] 
        FOREIGN KEY([ETFSymbolId]) REFERENCES [dbo].[TrackedSymbols] ([Id]) ON DELETE CASCADE;
    
    ALTER TABLE [dbo].[ETFHoldings] WITH CHECK ADD CONSTRAINT [FK_ETFHoldings_TrackedSymbols_HoldingSymbolId] 
        FOREIGN KEY([HoldingSymbolId]) REFERENCES [dbo].[TrackedSymbols] ([Id]) ON DELETE NO ACTION;
END
GO

-- Insert some sample data
IF NOT EXISTS (SELECT 1 FROM TrackedSymbols WHERE Symbol = 'AAPL')
BEGIN
    INSERT INTO TrackedSymbols (Symbol, Name, Type, AddedDate, Status, HistoricalDataStart, DataPoints, Description, Sector, Industry)
    VALUES 
        ('AAPL', 'Apple Inc.', 'STOCK', GETUTCDATE(), 'ACTIVE', '2020-01-01', 0, 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.', 'Technology', 'Consumer Electronics'),
        ('MSFT', 'Microsoft Corporation', 'STOCK', GETUTCDATE(), 'ACTIVE', '2020-01-01', 0, 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.', 'Technology', 'Software'),
        ('QQQ', 'Invesco QQQ Trust', 'ETF', GETUTCDATE(), 'ACTIVE', '2020-01-01', 0, 'Tracks the NASDAQ-100 Index', 'Financial Services', 'Exchange Traded Fund'),
        ('SPY', 'SPDR S&P 500 ETF Trust', 'ETF', GETUTCDATE(), 'ACTIVE', '2020-01-01', 0, 'Tracks the S&P 500 Index', 'Financial Services', 'Exchange Traded Fund');
END
GO

PRINT 'Trading Vision Analytics database schema created successfully!';
