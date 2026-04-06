using System;
using CustomerManagement;
using Microsoft.EntityFrameworkCore;

class Program
{
    static void Main()
    {
        using var context = new CustomerDbContext();

        // Create database and tables if they don't exist
        context.Database.Migrate();

        bool running = true;
        while (running)
        {
            Console.WriteLine("\n=== Customer Management System ===");
            Console.WriteLine("1. Add Customer");
            Console.WriteLine("2. View All Customers");
            Console.WriteLine("3. Find Customer by ID");
            Console.WriteLine("4. Update Customer");
            Console.WriteLine("5. Delete Customer");
            Console.WriteLine("6. Exit");
            Console.Write("Choose an option: ");

            string? choice = Console.ReadLine();
            switch (choice)
            {
                case "1":
                    AddCustomer(context);
                    break;
                case "2":
                    ViewAllCustomers(context);
                    break;
                case "3":
                    FindCustomerById(context);
                    break;
                case "4":
                    UpdateCustomer(context);
                    break;
                case "5":
                    DeleteCustomer(context);
                    break;
                case "6":
                    running = false;
                    break;
                default:
                    Console.WriteLine("Invalid option!");
                    break;
            }
        }
    }

    static void AddCustomer(CustomerDbContext context)
    {
        Console.Write("First Name: ");
        string? firstName = Console.ReadLine();
        Console.Write("Last Name: ");
        string? lastName = Console.ReadLine();
        Console.Write("Email: ");
        string? email = Console.ReadLine();
        Console.Write("Phone Number: ");
        string? phoneNumber = Console.ReadLine();

        var customer = new Customer
        {
            FirstName = firstName ?? "",
            LastName = lastName ?? "",
            Email = email ?? "",
            PhoneNumber = phoneNumber ?? ""
        };

        context.Customers.Add(customer);
        context.SaveChanges();
        Console.WriteLine("Customer added successfully!");
    }

    static void ViewAllCustomers(CustomerDbContext context)
    {
        var customers = context.Customers.OrderBy(c => c.FirstName).ToList();
        if (customers.Count == 0)
        {
            Console.WriteLine("No customers found.");
            return;
        }

        Console.WriteLine("\n=== All Customers ===");
        foreach (var customer in customers)
        {
            Console.WriteLine($"ID: {customer.Id}, Name: {customer.FirstName} {customer.LastName}, Email: {customer.Email}, Phone: {customer.PhoneNumber}");
        }
    }

    static void FindCustomerById(CustomerDbContext context)
    {
        Console.Write("Enter Customer ID: ");
        if (int.TryParse(Console.ReadLine(), out int id))
        {
            var customer = context.Customers.FirstOrDefault(c => c.Id == id);
            if (customer != null)
            {
                Console.WriteLine($"ID: {customer.Id}");
                Console.WriteLine($"Name: {customer.FirstName} {customer.LastName}");
                Console.WriteLine($"Email: {customer.Email}");
                Console.WriteLine($"Phone: {customer.PhoneNumber}");
                Console.WriteLine($"Created: {customer.CreatedAt}");
            }
            else
            {
                Console.WriteLine("Customer not found!");
            }
        }
        else
        {
            Console.WriteLine("Invalid ID!");
        }
    }

    static void UpdateCustomer(CustomerDbContext context)
    {
        Console.Write("Enter Customer ID: ");
        if (int.TryParse(Console.ReadLine(), out int id))
        {
            var customer = context.Customers.FirstOrDefault(c => c.Id == id);
            if (customer != null)
            {
                Console.Write("New First Name (leave blank to keep current): ");
                string? newFirstName = Console.ReadLine();
                if (!string.IsNullOrEmpty(newFirstName))
                    customer.FirstName = newFirstName;

                Console.Write("New Last Name (leave blank to keep current): ");
                string? newLastName = Console.ReadLine();
                if (!string.IsNullOrEmpty(newLastName))
                    customer.LastName = newLastName;

                Console.Write("New Email (leave blank to keep current): ");
                string? newEmail = Console.ReadLine();
                if (!string.IsNullOrEmpty(newEmail))
                    customer.Email = newEmail;

                Console.Write("New Phone (leave blank to keep current): ");
                string? newPhone = Console.ReadLine();
                if (!string.IsNullOrEmpty(newPhone))
                    customer.PhoneNumber = newPhone;

                context.SaveChanges();
                Console.WriteLine("Customer updated successfully!");
            }
            else
            {
                Console.WriteLine("Customer not found!");
            }
        }
        else
        {
            Console.WriteLine("Invalid ID!");
        }
    }

    static void DeleteCustomer(CustomerDbContext context)
    {
        Console.Write("Enter Customer ID: ");
        if (int.TryParse(Console.ReadLine(), out int id))
        {
            var customer = context.Customers.FirstOrDefault(c => c.Id == id);
            if (customer != null)
            {
                context.Customers.Remove(customer);
                context.SaveChanges();
                Console.WriteLine("Customer deleted successfully!");
            }
            else
            {
                Console.WriteLine("Customer not found!");
            }
        }
        else
        {
            Console.WriteLine("Invalid ID!");
        }
    }
}
