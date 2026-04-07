import { useMemo, useState } from 'react';

export default function ProductCatalog({ products }) {
  const initialState = useMemo(() => {
    const state = {};
    products.forEach(p => {
      state[p.id] = { checked: false, quantity: 1 };
    });
    return state;
  }, [products]);

  const [selections, setSelections] = useState(initialState);

  const selectedCount = Object.values(selections).filter(x => x.checked).length;

  function toggle(productId) {
    setSelections(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        checked: !prev[productId]?.checked,
      },
    }));
  }

  function changeQty(productId, delta) {
    setSelections(prev => {
      const next = Math.max(1, (prev[productId]?.quantity || 1) + delta);
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: next,
        },
      };
    });
  }

  if (!products.length) {
    return <p className="loading">Loading products...</p>;
  }

  return (
    <section className="catalog card">
      <div className="catalog-head">
        <h2>Products</h2>
        <span className="catalog-count">{selectedCount} selected</span>
      </div>

      <div className="catalog-list">
        {products.map(product => {
          const selected = selections[product.id]?.checked;
          const qty = selections[product.id]?.quantity || 1;
          return (
            <div className="catalog-row" key={product.id}>
              <label className="catalog-main">
                <input
                  type="checkbox"
                  checked={!!selected}
                  onChange={() => toggle(product.id)}
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
                <input type="text" className="qty-input" value={qty} readOnly disabled={!selected} />
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
    </section>
  );
}
