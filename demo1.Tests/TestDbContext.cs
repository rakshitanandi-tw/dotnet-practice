using CustomerManagement;
using Microsoft.EntityFrameworkCore;

namespace demo1.Tests;

public static class TestDbContext
{
    public static CustomerDbContext Create(string dbName)
    {
        var options = new DbContextOptionsBuilder<CustomerDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;

        var context = new CustomerDbContext(options);

        // Seed products
        context.Products.AddRange(
            new Product { Id = 1, Name = "Rice (5kg)", UnitPrice = 14.99m, IsGrocery = true },
            new Product { Id = 2, Name = "Milk (1L)",  UnitPrice = 1.49m,  IsGrocery = true }
        );

        // Seed a customer
        context.Customers.Add(new Customer
        {
            Id = 1,
            FirstName = "Jane",
            LastName = "Doe",
            Email = "jane@example.com",
            PhoneNumber = "0000000000"
        });

        context.SaveChanges();
        return context;
    }
}
