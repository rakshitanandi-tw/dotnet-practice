using CustomerManagement;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CustomerManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly CustomerDbContext _context;

        public OrdersController(CustomerDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                .ThenInclude(i => i.Product)
                .OrderByDescending(o => o.OrderedAt)
                .ToListAsync();

            return Ok(orders.Select(MapOrder));
        }

        [HttpPost]
        public async Task<ActionResult<OrderDto>> Create(CreateOrderRequest request)
        {
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == request.CustomerId);
            if (!customerExists)
            {
                return BadRequest("Customer does not exist.");
            }

            if (request.Items.Count == 0)
            {
                return BadRequest("Order must contain at least one product.");
            }

            var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
            var validProductIds = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .Select(p => p.Id)
                .ToListAsync();

            if (validProductIds.Count != productIds.Count)
            {
                return BadRequest("One or more products do not exist.");
            }

            if (request.Items.Any(i => i.Quantity <= 0))
            {
                return BadRequest("Quantity must be greater than 0.");
            }

            var order = new Order
            {
                CustomerId = request.CustomerId,
                OrderItems = request.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var savedOrder = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                .ThenInclude(i => i.Product)
                .FirstAsync(o => o.Id == order.Id);

            return CreatedAtAction(nameof(GetAll), new { id = savedOrder.Id }, MapOrder(savedOrder));
        }

        private static OrderDto MapOrder(Order order)
        {
            return new OrderDto(
                order.Id,
                order.CustomerId,
                order.Customer is null ? string.Empty : $"{order.Customer.FirstName} {order.Customer.LastName}",
                order.OrderedAt,
                order.OrderItems.Select(i => new OrderItemDto(
                    i.ProductId,
                    i.Product?.Name ?? string.Empty,
                    i.Quantity,
                    i.Product?.UnitPrice ?? 0,
                    i.Quantity * (i.Product?.UnitPrice ?? 0)
                )).ToList()
            );
        }
    }

    public record CreateOrderItemRequest(int ProductId, int Quantity);

    public record CreateOrderRequest(int CustomerId, List<CreateOrderItemRequest> Items);

    public record OrderItemDto(int ProductId, string ProductName, int Quantity, decimal UnitPrice, decimal LineTotal);

    public record OrderDto(int Id, int CustomerId, string CustomerName, DateTime OrderedAt, List<OrderItemDto> Items);
}
