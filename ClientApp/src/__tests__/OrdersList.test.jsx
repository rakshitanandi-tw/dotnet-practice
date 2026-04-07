import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import OrdersList from '../components/OrdersList'

const orders = [
  {
    id: 1,
    customerId: 1,
    customerName: 'Jane Doe',
    orderedAt: '2024-03-01T10:00:00Z',
    items: [
      { productId: 1, productName: 'Rice (5kg)', quantity: 2, unitPrice: 14.99, lineTotal: 29.98 },
      { productId: 2, productName: 'Milk (1L)',  quantity: 1, unitPrice: 1.49,  lineTotal: 1.49  },
    ],
  },
  {
    id: 2,
    customerId: 2,
    customerName: 'Bob Smith',
    orderedAt: '2024-03-02T12:00:00Z',
    items: [
      { productId: 2, productName: 'Milk (1L)', quantity: 3, unitPrice: 1.49, lineTotal: 4.47 },
    ],
  },
]

describe('OrdersList', () => {
  // ── Empty state ───────────────────────────────────────────────────────────

  it('shows empty message when no orders', () => {
    render(<OrdersList orders={[]} />)
    expect(screen.getByText(/no orders yet/i)).toBeInTheDocument()
  })

  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders a block for each order', () => {
    render(<OrdersList orders={orders} />)
    expect(screen.getByText('Order #1')).toBeInTheDocument()
    expect(screen.getByText('Order #2')).toBeInTheDocument()
  })

  it('shows customer names', () => {
    render(<OrdersList orders={orders} />)
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  })

  it('renders product line items', () => {
    render(<OrdersList orders={orders} />)
    expect(screen.getByText('Rice (5kg)')).toBeInTheDocument()
    expect(screen.getAllByText('Milk (1L)')).toHaveLength(2)
  })

  it('renders line total for each item', () => {
    render(<OrdersList orders={orders} />)
    expect(screen.getByText('$29.98')).toBeInTheDocument()
    expect(screen.getByText('$1.49')).toBeInTheDocument()
  })

  // ── Order totals ──────────────────────────────────────────────────────────

  it('shows correct order total (sum of line totals)', () => {
    render(<OrdersList orders={orders} />)
    // Order 1 total: 29.98 + 1.49 = 31.47 — only appears once (as order total)
    expect(screen.getByText('$31.47')).toBeInTheDocument()
    // Order 2 total $4.47 also appears as a line item total, so use class selector
    const totals = document.querySelectorAll('.order-total')
    expect(totals[1].textContent).toBe('$4.47')
  })

  it('shows the total count in the header', () => {
    render(<OrdersList orders={orders} />)
    expect(screen.getByText('2 total')).toBeInTheDocument()
  })
})
