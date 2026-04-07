export default function OrdersList({ orders }) {
  if (!orders.length) {
    return <p className="empty">No orders yet. Place an order to see it here.</p>;
  }

  return (
    <section className="card orders-card">
      <div className="catalog-head">
        <h2>Orders</h2>
        <span className="catalog-count">{orders.length} total</span>
      </div>

      <div className="orders-list">
        {orders.map(order => {
          const total = order.items.reduce((sum, item) => sum + item.lineTotal, 0);
          return (
            <div className="order-block" key={order.id}>
              <div className="order-top">
                <div>
                  <strong>Order #{order.id}</strong>
                  <div className="muted small">{new Date(order.orderedAt).toLocaleString()}</div>
                </div>
                <div>
                  <strong>{order.customerName}</strong>
                  <div className="muted small">Customer ID: {order.customerId}</div>
                </div>
                <div className="order-total">${total.toFixed(2)}</div>
              </div>

              <div className="order-items">
                {order.items.map(item => (
                  <div className="order-item-row" key={`${order.id}-${item.productId}`}>
                    <span>{item.productName}</span>
                    <span className="muted">Qty: {item.quantity}</span>
                    <span>${item.lineTotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
