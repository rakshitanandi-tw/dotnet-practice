import { useMemo, useState } from 'react';

export default function OrderForm({ customer, products, onSubmit, onCancel }) {
  const initialSelections = useMemo(() => {
    const map = {};
    products.forEach(p => {
      map[p.id] = { checked: false, quantity: 1 };
    });
    return map;
  }, [products]);

  const [selections, setSelections] = useState(initialSelections);
  const [error, setError] = useState('');

  function toggleProduct(productId) {
    setSelections(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        checked: !prev[productId].checked,
      },
    }));
  }

  function changeQty(productId, delta) {
    setSelections(prev => {
      const nextQty = Math.max(1, (prev[productId]?.quantity || 1) + delta);
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: nextQty,
        },
      };
    });
  }

  async function submit(e) {
    e.preventDefault();
    const items = Object.entries(selections)
      .filter(([, value]) => value.checked)
      .map(([productId, value]) => ({
        productId: Number(productId),
        quantity: value.quantity,
      }));

    if (items.length === 0) {
      setError('Select at least one product.');
      return;
    }

    setError('');
    await onSubmit(items);
  }

  return (
    <div className="overlay">
      <div className="modal order-modal">
        <h2>Create Order</h2>
        <p className="order-customer">
          Customer: <strong>{customer.firstName} {customer.lastName}</strong>
        </p>

        <form onSubmit={submit}>
          <div className="product-list">
            {products.map(product => {
              const selected = selections[product.id]?.checked;
              const quantity = selections[product.id]?.quantity || 1;
              return (
                <div className="product-row" key={product.id}>
                  <label className="product-main">
                    <input
                      type="checkbox"
                      checked={!!selected}
                      onChange={() => toggleProduct(product.id)}
                    />
                    <span>{product.name}</span>
                    <span className="product-price">${product.unitPrice.toFixed(2)}</span>
                  </label>

                  <div className="qty-box">
                    <button
                      type="button"
                      className="qty-btn"
                      disabled={!selected}
                      onClick={() => changeQty(product.id, -1)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="qty-input"
                      value={quantity}
                      readOnly
                      disabled={!selected}
                    />
                    <button
                      type="button"
                      className="qty-btn"
                      disabled={!selected}
                      onClick={() => changeQty(product.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn primary">Place Order</button>
          </div>
        </form>
      </div>
    </div>
  );
}
