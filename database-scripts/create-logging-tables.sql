-- Create ApiCallLogs table
CREATE TABLE [ApiCallLogs] (
    [Id] int NOT NULL IDENTITY(1,1),
    [Endpoint] nvarchar(200) NOT NULL,
    [HttpMethod] nvarchar(10) NOT NULL,
    [Parameters] nvarchar(1000) NULL,
    [StatusCode] int NOT NULL,
    [ResponseTimeMs] int NOT NULL,
    [Timestamp] datetime2 NOT NULL,
    [SymbolsRequested] int NOT NULL,
    [SymbolsSuccessful] int NOT NULL,
    [SymbolsFailed] int NOT NULL,
    [RequestId] nvarchar(50) NULL,
    [ErrorMessage] nvarchar(500) NULL,
    CONSTRAINT [PK_ApiCallLogs] PRIMARY KEY ([Id])
);

-- Create indexes for ApiCallLogs
CREATE INDEX [IX_ApiCallLogs_Timestamp] ON [ApiCallLogs] ([Timestamp]);
CREATE INDEX [IX_ApiCallLogs_Endpoint_Timestamp] ON [ApiCallLogs] ([Endpoint], [Timestamp]);

-- Create ApiExceptions table
CREATE TABLE [ApiExceptions] (
    [Id] int NOT NULL IDENTITY(1,1),
    [Source] nvarchar(100) NOT NULL,
    [ExceptionType] nvarchar(200) NOT NULL,
    [Message] nvarchar(1000) NOT NULL,
    [StackTrace] nvarchar(max) NULL,
    [Timestamp] datetime2 NOT NULL,
    [Severity] nvarchar(20) NOT NULL,
    [IsResolved] bit NOT NULL DEFAULT 0,
    [ResolvedAt] datetime2 NULL,
    [ResolutionNotes] nvarchar(500) NULL,
    [RequestId] nvarchar(50) NULL,
    [AdditionalContext] nvarchar(200) NULL,
    CONSTRAINT [PK_ApiExceptions] PRIMARY KEY ([Id])
);

-- Create indexes for ApiExceptions
CREATE INDEX [IX_ApiExceptions_Timestamp] ON [ApiExceptions] ([Timestamp]);
CREATE INDEX [IX_ApiExceptions_Source_Severity] ON [ApiExceptions] ([Source], [Severity]);

-- Create DailyApiSummaries table
CREATE TABLE [DailyApiSummaries] (
    [Id] int NOT NULL IDENTITY(1,1),
    [Date] date NOT NULL,
    [TotalCalls] int NOT NULL,
    [SuccessfulCalls] int NOT NULL,
    [FailedCalls] int NOT NULL,
    [UniqueSymbols] int NOT NULL,
    [AverageResponseTimeMs] int NOT NULL,
    [TotalSymbolsProcessed] int NOT NULL,
    [TotalSymbolsSuccessful] int NOT NULL,
    [TotalSymbolsFailed] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_DailyApiSummaries] PRIMARY KEY ([Id])
);

-- Create unique index for DailyApiSummaries
CREATE UNIQUE INDEX [IX_DailyApiSummaries_Date] ON [DailyApiSummaries] ([Date]);

PRINT 'Logging tables created successfully!';