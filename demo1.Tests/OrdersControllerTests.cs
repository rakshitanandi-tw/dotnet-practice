using CustomerManagement;
using CustomerManagement.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace demo1.Tests;

public class OrdersControllerTests
{
    // ── GET all ────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAll_EmptyDb_ReturnsEmptyList()
    {
        using var ctx = TestDbContext.Create(nameof(GetAll_EmptyDb_ReturnsEmptyList));
        var controller = new OrdersController(ctx);

        var result = await controller.GetAll();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var orders = Assert.IsAssignableFrom<IEnumerable<OrderDto>>(ok.Value);
        Assert.Empty(orders);
    }

    [Fact]
    public async Task GetAll_WithOrders_ReturnsOrdersWithItems()
    {
        using var ctx = TestDbContext.Create(nameof(GetAll_WithOrders_ReturnsOrdersWithItems));
        ctx.Orders.Add(new Order
        {
            CustomerId = 1,
            OrderItems = new List<OrderItem>
            {
                new OrderItem { ProductId = 1, Quantity = 2 }
            }
        });
        ctx.SaveChanges();

        var controller = new OrdersController(ctx);
        var result = await controller.GetAll();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var orders = Assert.IsAssignableFrom<IEnumerable<OrderDto>>(ok.Value).ToList();
        Assert.Single(orders);
        Assert.Single(orders[0].Items);
        Assert.Equal(2, orders[0].Items[0].Quantity);
    }

    // ── POST ───────────────────────────────────────────────────────────────

    [Fact]
    public async Task Create_ValidOrder_Returns201WithDto()
    {
        using var ctx = TestDbContext.Create(nameof(Create_ValidOrder_Returns201WithDto));
        var controller = new OrdersController(ctx);
        var req = new CreateOrderRequest(1, new List<CreateOrderItemRequest>
        {
            new CreateOrderItemRequest(1, 3),
            new CreateOrderItemRequest(2, 1)
        });

        var result = await controller.Create(req);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var order = Assert.IsType<OrderDto>(created.Value);
        Assert.Equal(1, order.CustomerId);
        Assert.Equal(2, order.Items.Count);
        Assert.Equal("Jane Doe", order.CustomerName);
    }

    [Fact]
    public async Task Create_CalculatesLineTotalsCorrectly()
    {
        using var ctx = TestDbContext.Create(nameof(Create_CalculatesLineTotalsCorrectly));
        var controller = new OrdersController(ctx);
        var req = new CreateOrderRequest(1, new List<CreateOrderItemRequest>
        {
            new CreateOrderItemRequest(1, 2) // Rice x2 = 29.98
        });

        var result = await controller.Create(req);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var order = Assert.IsType<OrderDto>(created.Value);
        Assert.Equal(29.98m, order.Items[0].LineTotal);
    }

    [Fact]
    public async Task Create_NonExistentCustomer_ReturnsBadRequest()
    {
        using var ctx = TestDbContext.Create(nameof(Create_NonExistentCustomer_ReturnsBadRequest));
        var controller = new OrdersController(ctx);
        var req = new CreateOrderRequest(999, new List<CreateOrderItemRequest>
        {
            new CreateOrderItemRequest(1, 1)
        });

        var result = await controller.Create(req);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task Create_EmptyItemsList_ReturnsBadRequest()
    {
        using var ctx = TestDbContext.Create(nameof(Create_EmptyItemsList_ReturnsBadRequest));
        var controller = new OrdersController(ctx);
        var req = new CreateOrderRequest(1, new List<CreateOrderItemRequest>());

        var result = await controller.Create(req);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task Create_NonExistentProduct_ReturnsBadRequest()
    {
        using var ctx = TestDbContext.Create(nameof(Create_NonExistentProduct_ReturnsBadRequest));
        var controller = new OrdersController(ctx);
        var req = new CreateOrderRequest(1, new List<CreateOrderItemRequest>
        {
            new CreateOrderItemRequest(999, 1)
        });

        var result = await controller.Create(req);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task Create_ZeroQuantity_ReturnsBadRequest()
    {
        using var ctx = TestDbContext.Create(nameof(Create_ZeroQuantity_ReturnsBadRequest));
        var controller = new OrdersController(ctx);
        var req = new CreateOrderRequest(1, new List<CreateOrderItemRequest>
        {
            new CreateOrderItemRequest(1, 0)
        });

        var result = await controller.Create(req);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task Create_NegativeQuantity_ReturnsBadRequest()
    {
        using var ctx = TestDbContext.Create(nameof(Create_NegativeQuantity_ReturnsBadRequest));
        var controller = new OrdersController(ctx);
        var req = new CreateOrderRequest(1, new List<CreateOrderItemRequest>
        {
            new CreateOrderItemRequest(1, -5)
        });

        var result = await controller.Create(req);

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task Create_SavesOrderToDatabase()
    {
        using var ctx = TestDbContext.Create(nameof(Create_SavesOrderToDatabase));
        var controller = new OrdersController(ctx);
        var req = new CreateOrderRequest(1, new List<CreateOrderItemRequest>
        {
            new CreateOrderItemRequest(1, 1)
        });

        await controller.Create(req);

        Assert.Single(ctx.Orders);
        Assert.Single(ctx.OrderItems);
    }
}
