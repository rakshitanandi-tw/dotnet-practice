import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomerTable from '../components/CustomerTable'

const customers = [
  {
    id: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    phoneNumber: '0000000000',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob@example.com',
    phoneNumber: '',
    createdAt: '2024-02-20T00:00:00Z',
  },
]

describe('CustomerTable', () => {
  // ── Empty state ───────────────────────────────────────────────────────────

  it('shows empty message when no customers', () => {
    render(<CustomerTable customers={[]} onEdit={vi.fn()} onDelete={vi.fn()} onOrder={vi.fn()} />)
    expect(screen.getByText(/no customers yet/i)).toBeInTheDocument()
  })

  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders a row for each customer', () => {
    render(<CustomerTable customers={customers} onEdit={vi.fn()} onDelete={vi.fn()} onOrder={vi.fn()} />)
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  })

  it('renders email and phone for each customer', () => {
    render(<CustomerTable customers={customers} onEdit={vi.fn()} onDelete={vi.fn()} onOrder={vi.fn()} />)
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('0000000000')).toBeInTheDocument()
  })

  it('shows dash when phone number is empty', () => {
    render(<CustomerTable customers={customers} onEdit={vi.fn()} onDelete={vi.fn()} onOrder={vi.fn()} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  // ── Buttons ───────────────────────────────────────────────────────────────

  it('calls onOrder with the customer when Order is clicked', async () => {
    const user = userEvent.setup()
    const onOrder = vi.fn()
    render(<CustomerTable customers={customers} onEdit={vi.fn()} onDelete={vi.fn()} onOrder={onOrder} />)
    const orderBtns = screen.getAllByText('Order')
    await user.click(orderBtns[0])
    expect(onOrder).toHaveBeenCalledWith(customers[0])
  })

  it('calls onEdit with the customer when Edit is clicked', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    render(<CustomerTable customers={customers} onEdit={onEdit} onDelete={vi.fn()} onOrder={vi.fn()} />)
    const editBtns = screen.getAllByText('Edit')
    await user.click(editBtns[1])
    expect(onEdit).toHaveBeenCalledWith(customers[1])
  })

  it('calls onDelete with customer id when Delete is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<CustomerTable customers={customers} onEdit={vi.fn()} onDelete={onDelete} onOrder={vi.fn()} />)
    const deleteBtns = screen.getAllByText('Delete')
    await user.click(deleteBtns[0])
    expect(onDelete).toHaveBeenCalledWith(1)
  })
})
