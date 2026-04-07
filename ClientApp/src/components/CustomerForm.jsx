import { useState, useEffect } from 'react';

const empty = { firstName: '', lastName: '', email: '', phoneNumber: '' };

export default function CustomerForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(initial
      ? { firstName: initial.firstName, lastName: initial.lastName,
          email: initial.email, phoneNumber: initial.phoneNumber }
      : empty);
  }, [initial]);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = e => { e.preventDefault(); onSubmit(form); };

  return (
    <div className="overlay">
      <div className="modal">
        <h2>{initial ? 'Edit Customer' : 'New Customer'}</h2>
        <form onSubmit={submit}>
          <div className="row">
            <div className="field">
              <label>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handle} required />
            </div>
            <div className="field">
              <label>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handle} required />
            </div>
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} required />
          </div>
          <div className="field">
            <label>Phone</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handle} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn primary">
              {initial ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
