import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OrderForm from '../components/OrderForm'

const customer = { id: 1, firstName: 'Jane', lastName: 'Doe' }
const products = [
  { id: 1, name: 'Rice (5kg)', unitPrice: 14.99 },
  { id: 2, name: 'Milk (1L)', unitPrice: 1.49 },
]

describe('OrderForm', () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it('shows customer name in header', () => {
    render(<OrderForm customer={customer} products={products} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
  })

  it('renders a checkbox row for each product', () => {
    render(<OrderForm customer={customer} products={products} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Rice (5kg)')).toBeInTheDocument()
    expect(screen.getByText('Milk (1L)')).toBeInTheDocument()
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(2)
  })

  it('renders product prices', () => {
    render(<OrderForm customer={customer} products={products} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('$14.99')).toBeInTheDocument()
    expect(screen.getByText('$1.49')).toBeInTheDocument()
  })

  // ── Interaction ───────────────────────────────────────────────────────────

  it('enables qty buttons after checking a product', async () => {
    const user = userEvent.setup()
    render(<OrderForm customer={customer} products={products} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    const [firstCheckbox] = screen.getAllByRole('checkbox')
    await user.click(firstCheckbox)

    const plusBtns = screen.getAllByText('+')
    expect(plusBtns[0]).not.toBeDisabled()
  })

  it('increments quantity when + is clicked', async () => {
    const user = userEvent.setup()
    render(<OrderForm customer={customer} products={products} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    const [firstCheckbox] = screen.getAllByRole('checkbox')
    await user.click(firstCheckbox)

    const plusBtn = screen.getAllByText('+')[0]
    await user.click(plusBtn)

    const qtyInputs = screen.getAllByRole('textbox')
    expect(qtyInputs[0].value).toBe('2')
  })

  it('does not decrement quantity below 1', async () => {
    const user = userEvent.setup()
    render(<OrderForm customer={customer} products={products} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    const [firstCheckbox] = screen.getAllByRole('checkbox')
    await user.click(firstCheckbox)

    const minusBtn = screen.getAllByText('-')[0]
    await user.click(minusBtn)

    const qtyInputs = screen.getAllByRole('textbox')
    expect(qtyInputs[0].value).toBe('1')
  })

  // ── Validation ────────────────────────────────────────────────────────────

  it('shows error when submitting with no products selected', async () => {
    const user = userEvent.setup()
    render(<OrderForm customer={customer} products={products} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    await user.click(screen.getByText('Place Order'))
    expect(screen.getByText(/select at least one product/i)).toBeInTheDocument()
  })

  // ── Submit ────────────────────────────────────────────────────────────────

  it('calls onSubmit with correct items when form is valid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<OrderForm customer={customer} products={products} onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.click(screen.getAllByRole('checkbox')[0])
    await user.click(screen.getByText('Place Order'))

    expect(onSubmit).toHaveBeenCalledWith([{ productId: 1, quantity: 1 }])
  })

  // ── Cancel ────────────────────────────────────────────────────────────────

  it('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<OrderForm customer={customer} products={products} onSubmit={vi.fn()} onCancel={onCancel} />)
    await user.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
