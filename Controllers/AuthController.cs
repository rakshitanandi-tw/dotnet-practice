using CustomerManagement;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CustomerManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly CustomerDbContext _context;
        private readonly PasswordHasher<AuthUser> _passwordHasher = new();

        public AuthController(CustomerDbContext context)
        {
            _context = context;
        }

        // POST api/auth/register
        [HttpPost("register")]
        public async Task<ActionResult<CustomerSession>> Register(RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.FirstName) ||
                string.IsNullOrWhiteSpace(request.LastName))
            {
                return BadRequest("All fields are required.");
            }

            var normalizedEmail = NormalizeEmail(request.Email);

            var existingAuthUser = await _context.AuthUsers
                .AsNoTracking()
                .FirstOrDefaultAsync(user => user.NormalizedEmail == normalizedEmail);

            if (existingAuthUser is not null)
            {
                return Conflict("An account with that email already exists.");
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(existingCustomer => existingCustomer.Email.ToLower() == normalizedEmail);

            if (customer is null)
            {
                customer = new Customer
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email.Trim(),
                    PhoneNumber = request.PhoneNumber ?? string.Empty,
                };
                _context.Customers.Add(customer);
            }
            else
            {
                customer.FirstName = request.FirstName;
                customer.LastName = request.LastName;
                customer.PhoneNumber = request.PhoneNumber ?? customer.PhoneNumber;
            }

            await _context.SaveChangesAsync();

            var authUser = new AuthUser
            {
                CustomerId = customer.Id,
                Email = customer.Email,
                NormalizedEmail = normalizedEmail,
            };
            authUser.PasswordHash = _passwordHasher.HashPassword(authUser, request.Password);

            _context.AuthUsers.Add(authUser);
            await _context.SaveChangesAsync();

            return Ok(new CustomerSession(customer.Id, customer.FirstName, customer.LastName, customer.Email));
        }

        // POST api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<CustomerSession>> Login(LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Email and password are required.");
            }

            var normalizedEmail = NormalizeEmail(request.Email);

            var authUser = await _context.AuthUsers
                .Include(user => user.Customer)
                .FirstOrDefaultAsync(user => user.NormalizedEmail == normalizedEmail);

            if (authUser is null)
            {
                return Unauthorized("Invalid email or password.");
            }

            var verificationResult = _passwordHasher.VerifyHashedPassword(authUser, authUser.PasswordHash, request.Password);

            if (verificationResult == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid email or password.");
            }

            var customer = authUser.Customer;

            if (customer is null)
            {
                return NotFound("Customer profile not found. Please register again.");
            }

            return Ok(new CustomerSession(customer.Id, customer.FirstName, customer.LastName, customer.Email));
        }

        private static string NormalizeEmail(string email)
        {
            return email.Trim().ToLowerInvariant();
        }
    }

    public record LoginRequest(string Email, string Password);

    public record RegisterRequest(
        string FirstName,
        string LastName,
        string Email,
        string Password,
        string? PhoneNumber
    );

    public record CustomerSession(int CustomerId, string FirstName, string LastName, string Email);
}
