using CustomerManagement;
using CustomerManagement.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

namespace demo1.Tests;

public class AuthControllerTests
{
    [Fact]
    public async Task Register_NewEmail_CreatesCustomerAndAuthUser()
    {
        using var ctx = TestDbContext.Create(nameof(Register_NewEmail_CreatesCustomerAndAuthUser));
        var controller = new AuthController(ctx);

        var result = await controller.Register(new RegisterRequest(
            "John",
            "Smith",
            "john@example.com",
            "Password@123",
            "1111111111"
        ));

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var session = Assert.IsType<CustomerSession>(ok.Value);

        Assert.Equal("john@example.com", session.Email);
        Assert.Equal(2, ctx.Customers.Count());
        Assert.Single(ctx.AuthUsers);
        Assert.Equal(session.CustomerId, ctx.AuthUsers.Single().CustomerId);
        Assert.NotEqual("Password@123", ctx.AuthUsers.Single().PasswordHash);
    }

    [Fact]
    public async Task Register_ExistingCustomerEmail_AttachesAuthUserToExistingCustomer()
    {
        using var ctx = TestDbContext.Create(nameof(Register_ExistingCustomerEmail_AttachesAuthUserToExistingCustomer));
        var controller = new AuthController(ctx);

        var result = await controller.Register(new RegisterRequest(
            "Jane",
            "Doe",
            "jane@example.com",
            "Password@123",
            "0000000000"
        ));

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var session = Assert.IsType<CustomerSession>(ok.Value);

        Assert.Equal(1, session.CustomerId);
        Assert.Single(ctx.Customers);
        Assert.Single(ctx.AuthUsers);
    }

    [Fact]
    public async Task Register_DuplicateAuthEmail_ReturnsConflict()
    {
        using var ctx = TestDbContext.Create(nameof(Register_DuplicateAuthEmail_ReturnsConflict));
        var passwordHasher = new PasswordHasher<AuthUser>();
        var authUser = new AuthUser
        {
            CustomerId = 1,
            Email = "jane@example.com",
            NormalizedEmail = "jane@example.com"
        };
        authUser.PasswordHash = passwordHasher.HashPassword(authUser, "Password@123");
        ctx.AuthUsers.Add(authUser);
        await ctx.SaveChangesAsync();

        var controller = new AuthController(ctx);
        var result = await controller.Register(new RegisterRequest(
            "Jane",
            "Doe",
            "jane@example.com",
            "AnotherPassword@123",
            "0000000000"
        ));

        Assert.IsType<ConflictObjectResult>(result.Result);
    }

    [Fact]
    public async Task Login_ValidCredentials_ReturnsSession()
    {
        using var ctx = TestDbContext.Create(nameof(Login_ValidCredentials_ReturnsSession));
        var passwordHasher = new PasswordHasher<AuthUser>();
        var authUser = new AuthUser
        {
            CustomerId = 1,
            Email = "jane@example.com",
            NormalizedEmail = "jane@example.com"
        };
        authUser.PasswordHash = passwordHasher.HashPassword(authUser, "Password@123");
        ctx.AuthUsers.Add(authUser);
        await ctx.SaveChangesAsync();

        var controller = new AuthController(ctx);
        var result = await controller.Login(new LoginRequest("jane@example.com", "Password@123"));

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var session = Assert.IsType<CustomerSession>(ok.Value);
        Assert.Equal(1, session.CustomerId);
    }

    [Fact]
    public async Task Login_InvalidPassword_ReturnsUnauthorized()
    {
        using var ctx = TestDbContext.Create(nameof(Login_InvalidPassword_ReturnsUnauthorized));
        var passwordHasher = new PasswordHasher<AuthUser>();
        var authUser = new AuthUser
        {
            CustomerId = 1,
            Email = "jane@example.com",
            NormalizedEmail = "jane@example.com"
        };
        authUser.PasswordHash = passwordHasher.HashPassword(authUser, "Password@123");
        ctx.AuthUsers.Add(authUser);
        await ctx.SaveChangesAsync();

        var controller = new AuthController(ctx);
        var result = await controller.Login(new LoginRequest("jane@example.com", "WrongPassword"));

        Assert.IsType<UnauthorizedObjectResult>(result.Result);
    }
}
