import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import OrderForm from './components/OrderForm';
import OrdersList from './components/OrdersList';
import { createOrder, getOrders, getProducts } from './api';

export default function App() {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('session'));
    } catch {
      return null;
    }
  });
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const handleLogin = nextSession => {
    sessionStorage.setItem('session', JSON.stringify(nextSession));
    setSession(nextSession);
    setError('');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('session');
    setSession(null);
    setOrders([]);
    setShowOrderForm(false);
    setError('');
  };

  useEffect(() => {
    async function loadProducts() {
      try {
        setProducts(await getProducts());
      } catch {
        setError('Failed to load products.');
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function loadOrders() {
      if (!session) return;

      try {
        const allOrders = await getOrders();
        setOrders(allOrders.filter(order => order.customerId === session.customerId));
      } catch {
        setError('Failed to load orders.');
      }
    }

    loadOrders();
  }, [session]);

  const handleOrderSubmit = async items => {
    try {
      await createOrder({
        customerId: session.customerId,
        items,
      });

      const allOrders = await getOrders();
      setOrders(allOrders.filter(order => order.customerId === session.customerId));
      setShowOrderForm(false);
      setError('');
    } catch {
      setError('Failed to place order.');
    }
  };

  if (!session) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header>
        <div>
          <h1>Customer Management</h1>
          <span className="count">Welcome, {session.firstName}!</span>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => setShowOrderForm(true)}>
            + New Order
          </button>
          <button className="btn secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1rem' }}>
        <strong>{session.firstName} {session.lastName}</strong>
        <span className="muted" style={{ marginLeft: '1rem' }}>{session.email}</span>
      </div>

      <OrdersList orders={orders} />

      {showOrderForm && (
        <OrderForm
          customer={{
            id: session.customerId,
            firstName: session.firstName,
            lastName: session.lastName,
          }}
          products={products}
          onSubmit={handleOrderSubmit}
          onCancel={() => setShowOrderForm(false)}
        />
      )}
    </div>
  );
}
