import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getProducts,
  createOrder,
  getOrders,
} from '../api'

function mockFetch(body, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  })
}

beforeEach(() => {
  vi.restoreAllMocks()
})

// ── getCustomers ────────────────────────────────────────────────────────────

describe('getCustomers', () => {
  it('returns data on success', async () => {
    global.fetch = mockFetch([{ id: 1, firstName: 'Jane' }])
    const data = await getCustomers()
    expect(data).toEqual([{ id: 1, firstName: 'Jane' }])
    expect(fetch).toHaveBeenCalledWith('/api/customers')
  })

  it('throws on non-ok response', async () => {
    global.fetch = mockFetch(null, false, 500)
    await expect(getCustomers()).rejects.toThrow('Failed to fetch')
  })
})

// ── createCustomer ──────────────────────────────────────────────────────────

describe('createCustomer', () => {
  it('posts JSON and returns created customer', async () => {
    const customer = { firstName: 'John', lastName: 'Smith', email: 'j@s.com' }
    global.fetch = mockFetch({ id: 2, ...customer })
    const data = await createCustomer(customer)
    expect(data.id).toBe(2)
    expect(fetch).toHaveBeenCalledWith('/api/customers', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    }))
  })

  it('throws on failure', async () => {
    global.fetch = mockFetch(null, false, 400)
    await expect(createCustomer({})).rejects.toThrow('Failed to create')
  })
})

// ── updateCustomer ──────────────────────────────────────────────────────────

describe('updateCustomer', () => {
  it('puts to correct URL and returns updated customer', async () => {
    global.fetch = mockFetch({ id: 1, firstName: 'Updated' })
    const data = await updateCustomer(1, { firstName: 'Updated' })
    expect(data.firstName).toBe('Updated')
    expect(fetch).toHaveBeenCalledWith('/api/customers/1', expect.objectContaining({ method: 'PUT' }))
  })

  it('throws on failure', async () => {
    global.fetch = mockFetch(null, false, 404)
    await expect(updateCustomer(999, {})).rejects.toThrow('Failed to update')
  })
})

// ── deleteCustomer ──────────────────────────────────────────────────────────

describe('deleteCustomer', () => {
  it('sends DELETE request to correct URL', async () => {
    global.fetch = mockFetch(null, true, 204)
    await deleteCustomer(1)
    expect(fetch).toHaveBeenCalledWith('/api/customers/1', { method: 'DELETE' })
  })

  it('throws on failure', async () => {
    global.fetch = mockFetch(null, false, 404)
    await expect(deleteCustomer(999)).rejects.toThrow('Failed to delete')
  })
})

// ── getProducts ─────────────────────────────────────────────────────────────

describe('getProducts', () => {
  it('returns products on success', async () => {
    global.fetch = mockFetch([{ id: 1, name: 'Milk' }])
    const data = await getProducts()
    expect(data).toEqual([{ id: 1, name: 'Milk' }])
    expect(fetch).toHaveBeenCalledWith('/api/products')
  })

  it('throws on failure', async () => {
    global.fetch = mockFetch(null, false, 500)
    await expect(getProducts()).rejects.toThrow('Failed to fetch products')
  })
})

// ── createOrder ─────────────────────────────────────────────────────────────

describe('createOrder', () => {
  it('posts order and returns dto', async () => {
    const payload = { customerId: 1, items: [{ productId: 1, quantity: 2 }] }
    global.fetch = mockFetch({ id: 10, ...payload })
    const data = await createOrder(payload)
    expect(data.id).toBe(10)
    expect(fetch).toHaveBeenCalledWith('/api/orders', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(payload),
    }))
  })

  it('throws on failure', async () => {
    global.fetch = mockFetch(null, false, 400)
    await expect(createOrder({})).rejects.toThrow('Failed to create order')
  })
})

// ── getOrders ───────────────────────────────────────────────────────────────

describe('getOrders', () => {
  it('returns orders on success', async () => {
    global.fetch = mockFetch([{ id: 1 }])
    const data = await getOrders()
    expect(data).toEqual([{ id: 1 }])
    expect(fetch).toHaveBeenCalledWith('/api/orders')
  })

  it('throws on failure', async () => {
    global.fetch = mockFetch(null, false, 500)
    await expect(getOrders()).rejects.toThrow('Failed to fetch orders')
  })
})
