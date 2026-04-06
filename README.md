# Customer Management System

A .NET 10 console application for managing customer details with PostgreSQL database.

## Prerequisites

- .NET 10 SDK installed
- PostgreSQL server running
- DBeaver (optional, for viewing the database)

## Setup Instructions

### 1. PostgreSQL Database Setup

Create a PostgreSQL database and user:

```sql
-- Connect to PostgreSQL as admin
createdb customer_db

-- Verify database creation
\l
```

### 2. Update Connection String (if needed)

Edit `CustomerDbContext.cs` and update the connection string in `OnConfiguring`:

```csharp
optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=customer_db;Username=postgres;Password=postgres");
```

**Default values:**
- Host: `localhost`
- Port: `5432`
- Database: `customer_db`
- Username: `postgres`
- Password: `postgres`

### 3. Run Database Migration

Apply the migration to create tables:

```bash
dotnet ef database update
```

### 4. Run the Application

```bash
dotnet run
```

## Features

- **Add Customer**: Create new customer records with name, email, and phone
- **View All Customers**: List all customers in the database
- **Find Customer**: Search for a customer by ID
- **Update Customer**: Modify existing customer information
- **Delete Customer**: Remove a customer from the database

## Database Schema

### Customers Table
- `Id` (int, primary key) - Auto-generated
- `FirstName` (varchar, max 100) - Required
- `LastName` (varchar, max 100) - Required
- `Email` (varchar, max 255) - Required
- `PhoneNumber` (varchar, max 20) - Optional
- `CreatedAt` (timestamp) - Auto-set to current UTC time

## Viewing Database in DBeaver

1. Open DBeaver
2. Create a new PostgreSQL connection:
   - Host: `localhost`
   - Port: `5432`
   - Database: `customer_db`
   - Username: `postgres`
   - Password: `postgres`
3. Navigate to `public.customers` table to view all records

## Troubleshooting

**Connection refused error:**
- Ensure PostgreSQL is running
- Check host, port, and credentials in connection string

**Table doesn't exist:**
- Run: `dotnet ef database update`

**Migration errors:**
- Verify Entity Framework tools are installed
- Run: `dotnet tool install --global dotnet-ef` (if needed)
