## Your task
* Create the basic plumbing for the app as described below.
* Do not create the POCOs for the database yet.
* We will use the Database named TVA. It is already created.
* Hook the UI to the for a few basic calls and returned Static data and objects from the Python API
* Create some basic unit tests for C# API, but do not make calls the FMP 3rd Party Endpoint yet.
* Log the API calls to a text file.

## Tech Stack
* Database - SQL Server Developer Version
* Backend - C# Asp.net Core
* ORM - EF Core 
* Python API - with DB connectivity
* SQLAlchemy Core - for Python DB connectivity
* ASP.Net Core API - with EF Core to DB Connectivity
* NextJS - Front end. This already exists. 
* xUnit

## Dev Workflow
* POCOs are created based off of the UI App
* DB Tables are built based off of the POCOs
* We are not using EF Migrations
* EF Core is used to Call 3rd Party API for stock data (FMP) https://site.financialmodelingprep.com/ and EF Core populates the SQL server database.
* Python API is used to communicate with the UI
* NextJS is used in the UI.

## Loggin and Errors
* Logging is required for the calls to the 3rd party service. I need to know when we are calling, what we are calling and the status.
* The Logging is available in the UI
* Errors between the Python API and the UI - Readable Errors are reported back to the UI


## Testing
* Create Unit tests using xUnit for the C# API for the 3rd party Calls. 

## Connections
* Important - DO NOT THIS FILE INTO GIT - ADD THIS FILE TO GetIngore
* SQL Server Developer - sa, Pwd - MJMS0ft
* FMP API Key - API Key: 
To authorize your requests, add ?apikey=Wl1tq6IwEWDm1MMz6gLhLoKBAT73kxA3