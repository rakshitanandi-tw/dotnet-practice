using CustomerManagement;
using CustomerManagement.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace demo1.Tests;

public class ProductsControllerTests
{
    [Fact]
    public async Task GetAll_ReturnsAllProducts_OrderedByName()
    {
        using var ctx = TestDbContext.Create(nameof(GetAll_ReturnsAllProducts_OrderedByName));
        var controller = new ProductsController(ctx);

        var result = await controller.GetAll();

        var products = Assert.IsAssignableFrom<IEnumerable<Product>>(result.Value);
        var list = products.ToList();
        Assert.Equal(2, list.Count);
        // Should be alphabetically ordered: Milk before Rice
        Assert.Equal("Milk (1L)", list[0].Name);
        Assert.Equal("Rice (5kg)", list[1].Name);
    }

    [Fact]
    public async Task GetAll_ReturnsCorrectPrices()
    {
        using var ctx = TestDbContext.Create(nameof(GetAll_ReturnsCorrectPrices));
        var controller = new ProductsController(ctx);

        var result = await controller.GetAll();

        var products = result.Value!.ToList();
        Assert.All(products, p => Assert.True(p.UnitPrice > 0));
    }

    [Fact]
    public async Task GetAll_AllProductsAreGroceries()
    {
        using var ctx = TestDbContext.Create(nameof(GetAll_AllProductsAreGroceries));
        var controller = new ProductsController(ctx);

        var result = await controller.GetAll();

        Assert.All(result.Value!, p => Assert.True(p.IsGrocery));
    }
}
