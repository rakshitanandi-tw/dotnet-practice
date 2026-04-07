import { useState, useEffect } from 'react';
import CustomerTable from './components/CustomerTable';
import CustomerForm from './components/CustomerForm';
import OrderForm from './components/OrderForm';
import OrdersList from './components/OrdersList';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, getProducts, createOrder, getOrders } from './api';


export default function App() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [products, setProducts]   = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [recentCustomer, setRecentCustomer] = useState(null);
  const [orders, setOrders] = useState([]);

  const load = async () => {
    try {
      setError('');
      setLoading(true);
      setCustomers(await getCustomers());
    } catch {
      setError('Cannot reach the API. Is the .NET server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const loadProducts = async () => {
    try {
      setProducts(await getProducts());
    } catch {
      setError('Failed to load products.');
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const loadOrders = async () => {
    try {
      setOrders(await getOrders());
    } catch {
      setError('Failed to load orders.');
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const handleSubmit = async data => {
    try {
      if (editing) {
        await updateCustomer(editing.id, data);
      } else {
        const created = await createCustomer(data);
        setRecentCustomer(created);
      }
      setShowForm(false);
      setEditing(null);
      load();
    } catch {
      setError('Failed to save customer.');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this customer?')) return;
    try { await deleteCustomer(id); load(); }
    catch { setError('Failed to delete customer.'); }
  };

  const openOrder = customer => {
    setSelectedCustomer(customer);
    setShowOrderForm(true);
    setRecentCustomer(null);
  };

  const handleOrderSubmit = async items => {
    try {
      await createOrder({
        customerId: selectedCustomer.id,
        items,
      });
      setShowOrderForm(false);
      setSelectedCustomer(null);
      setError('');
      await loadOrders();
    } catch {
      setError('Failed to place order.');
    }
  };

  return (
    <div className="app">
      <header>
        <div>
          <h1>Customer Management</h1>
          <span className="count">{customers.length} customer{customers.length !== 1 ? 's' : ''}</span>
        </div>
        <button className="btn primary" onClick={() => { setEditing(null); setShowForm(true); }}>
          + Add Customer
        </button>
      </header>

      {error && <div className="error">{error}</div>}

      {recentCustomer && (
        <div className="notice">
          Customer {recentCustomer.firstName} added successfully.
          <button className="btn sm order" onClick={() => openOrder(recentCustomer)}>
            Order Now
          </button>
        </div>
      )}

      {loading
        ? <p className="loading">Loading...</p>
        : <CustomerTable customers={customers} onEdit={c => { setEditing(c); setShowForm(true); }} onDelete={handleDelete} onOrder={openOrder} />
      }

      <OrdersList orders={orders} />

      {showForm && (
        <CustomerForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {showOrderForm && selectedCustomer && (
        <OrderForm
          customer={selectedCustomer}
          products={products}
          onSubmit={handleOrderSubmit}
          onCancel={() => { setShowOrderForm(false); setSelectedCustomer(null); }}
        />
      )}
    </div>
  );
}
