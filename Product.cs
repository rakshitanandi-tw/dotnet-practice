namespace CustomerManagement
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public bool IsGrocery { get; set; } = true;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
