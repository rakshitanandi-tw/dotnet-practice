import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomerForm from '../components/CustomerForm'

const mockCustomer = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  phoneNumber: '0000000000',
}

describe('CustomerForm', () => {
  // ── Mode detection ────────────────────────────────────────────────────────

  it('shows "New Customer" title when no initial value', () => {
    render(<CustomerForm onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('New Customer')).toBeInTheDocument()
    expect(screen.getByText('Add Customer')).toBeInTheDocument()
  })

  it('shows "Edit Customer" title when initial value provided', () => {
    render(<CustomerForm initial={mockCustomer} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Edit Customer')).toBeInTheDocument()
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  // ── Pre-fill ──────────────────────────────────────────────────────────────

  it('pre-fills fields from initial prop', () => {
    render(<CustomerForm initial={mockCustomer} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByDisplayValue('Jane')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument()
  })

  it('renders empty fields when no initial value', () => {
    render(<CustomerForm onSubmit={vi.fn()} onCancel={vi.fn()} />)
    // Labels have no htmlFor, so query by input name attribute
    expect(document.querySelector('input[name="firstName"]').value).toBe('')
    expect(document.querySelector('input[name="lastName"]').value).toBe('')
    expect(document.querySelector('input[name="email"]').value).toBe('')
  })

  // ── Submit ────────────────────────────────────────────────────────────────

  it('calls onSubmit with form values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<CustomerForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(document.querySelector('input[name="firstName"]'), 'John')
    await user.type(document.querySelector('input[name="lastName"]'), 'Smith')
    await user.type(document.querySelector('input[name="email"]'), 'john@smith.com')
    await user.click(screen.getByText('Add Customer'))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@smith.com',
    }))
  })

  // ── Cancel ────────────────────────────────────────────────────────────────

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<CustomerForm onSubmit={vi.fn()} onCancel={onCancel} />)
    await user.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
