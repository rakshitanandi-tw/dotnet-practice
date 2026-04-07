using Microsoft.EntityFrameworkCore;

namespace CustomerManagement
{
    public class CustomerDbContext : DbContext
    {
        public CustomerDbContext(DbContextOptions<CustomerDbContext> options) : base(options) { }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<AuthUser> AuthUsers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
                optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=customer_db;Username=postgres;Password=postgres");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FirstName).HasMaxLength(100).IsRequired();
                entity.Property(e => e.LastName).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Email).HasMaxLength(255).IsRequired();
                entity.Property(e => e.PhoneNumber).HasMaxLength(20);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            });

            modelBuilder.Entity<AuthUser>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).HasMaxLength(255).IsRequired();
                entity.Property(e => e.NormalizedEmail).HasMaxLength(255).IsRequired();
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");

                entity.HasIndex(e => e.NormalizedEmail).IsUnique();
                entity.HasIndex(e => e.CustomerId).IsUnique();

                entity.HasOne(e => e.Customer)
                    .WithOne(c => c.AuthUser)
                    .HasForeignKey<AuthUser>(e => e.CustomerId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(150).IsRequired();
                entity.Property(e => e.UnitPrice).HasColumnType("numeric(10,2)").IsRequired();
                entity.Property(e => e.IsGrocery).HasDefaultValue(true);

                entity.HasData(
                    new Product { Id = 1, Name = "Rice (5kg)", UnitPrice = 14.99m, IsGrocery = true },
                    new Product { Id = 2, Name = "Milk (1L)", UnitPrice = 1.49m, IsGrocery = true },
                    new Product { Id = 3, Name = "Bread", UnitPrice = 2.19m, IsGrocery = true },
                    new Product { Id = 4, Name = "Eggs (12)", UnitPrice = 3.99m, IsGrocery = true }
                );
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.OrderedAt).HasDefaultValueSql("now()");

                entity.HasOne(e => e.Customer)
                    .WithMany(c => c.Orders)
                    .HasForeignKey(e => e.CustomerId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => new { e.OrderId, e.ProductId });
                entity.Property(e => e.Quantity).IsRequired();

                entity.HasOne(e => e.Order)
                    .WithMany(o => o.OrderItems)
                    .HasForeignKey(e => e.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Product)
                    .WithMany(p => p.OrderItems)
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
