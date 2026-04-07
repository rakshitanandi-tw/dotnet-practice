using CustomerManagement;
using CustomerManagement.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace demo1.Tests;

public class CustomersControllerTests
{
    // ── GET all ────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAll_ReturnsAllCustomers()
    {
        using var ctx = TestDbContext.Create(nameof(GetAll_ReturnsAllCustomers));
        var controller = new CustomersController(ctx);

        var result = await controller.GetAll();

        var customers = Assert.IsAssignableFrom<IEnumerable<Customer>>(result.Value);
        Assert.Single(customers);
    }

    // ── GET by id ──────────────────────────────────────────────────────────

    [Fact]
    public async Task GetById_ExistingId_ReturnsCustomer()
    {
        using var ctx = TestDbContext.Create(nameof(GetById_ExistingId_ReturnsCustomer));
        var controller = new CustomersController(ctx);

        var result = await controller.GetById(1);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var customer = Assert.IsType<Customer>(ok.Value);
        Assert.Equal("Jane", customer.FirstName);
    }

    [Fact]
    public async Task GetById_NonExistentId_ReturnsNotFound()
    {
        using var ctx = TestDbContext.Create(nameof(GetById_NonExistentId_ReturnsNotFound));
        var controller = new CustomersController(ctx);

        var result = await controller.GetById(999);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    // ── POST ───────────────────────────────────────────────────────────────

    [Fact]
    public async Task Create_ValidRequest_ReturnsCreatedCustomer()
    {
        using var ctx = TestDbContext.Create(nameof(Create_ValidRequest_ReturnsCreatedCustomer));
        var controller = new CustomersController(ctx);
        var req = new CustomerRequest("John", "Smith", "john@example.com", "1111111111");

        var result = await controller.Create(req);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var customer = Assert.IsType<Customer>(created.Value);
        Assert.Equal("John", customer.FirstName);
        Assert.Equal(2, ctx.Customers.Count());
    }

    // ── PUT ────────────────────────────────────────────────────────────────

    [Fact]
    public async Task Update_ExistingId_UpdatesAndReturnsCustomer()
    {
        using var ctx = TestDbContext.Create(nameof(Update_ExistingId_UpdatesAndReturnsCustomer));
        var controller = new CustomersController(ctx);
        var req = new CustomerRequest("Updated", "Name", "updated@example.com", "9999999999");

        var result = await controller.Update(1, req);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var customer = Assert.IsType<Customer>(ok.Value);
        Assert.Equal("Updated", customer.FirstName);
    }

    [Fact]
    public async Task Update_NonExistentId_ReturnsNotFound()
    {
        using var ctx = TestDbContext.Create(nameof(Update_NonExistentId_ReturnsNotFound));
        var controller = new CustomersController(ctx);
        var req = new CustomerRequest("X", "Y", "x@y.com", null);

        var result = await controller.Update(999, req);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    // ── DELETE ─────────────────────────────────────────────────────────────

    [Fact]
    public async Task Delete_ExistingId_RemovesCustomerAndReturnsNoContent()
    {
        using var ctx = TestDbContext.Create(nameof(Delete_ExistingId_RemovesCustomerAndReturnsNoContent));
        var controller = new CustomersController(ctx);

        var result = await controller.Delete(1);

        Assert.IsType<NoContentResult>(result);
        Assert.Empty(ctx.Customers);
    }

    [Fact]
    public async Task Delete_NonExistentId_ReturnsNotFound()
    {
        using var ctx = TestDbContext.Create(nameof(Delete_NonExistentId_ReturnsNotFound));
        var controller = new CustomersController(ctx);

        var result = await controller.Delete(999);

        Assert.IsType<NotFoundResult>(result);
    }
}
