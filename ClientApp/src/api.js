const BASE = '/api/customers';
const PRODUCTS_BASE = '/api/products';
const ORDERS_BASE = '/api/orders';

export async function getCustomers() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createCustomer(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateCustomer(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteCustomer(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

export async function getProducts() {
  const res = await fetch(PRODUCTS_BASE);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function createOrder(data) {
  const res = await fetch(ORDERS_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}

export async function getOrders() {
  const res = await fetch(ORDERS_BASE);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}
