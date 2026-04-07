import { useState } from 'react';
import { login, register } from '../api';

export default function LoginForm({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let session;
      if (mode === 'login') {
        session = await login(form.email, form.password);
      } else {
        session = await register({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          phoneNumber: form.phoneNumber,
        });
      }
      onLogin(session);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Customer Management</h1>
        <div className="mode-tabs">
          <button
            className={`tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
            type="button"
          >
            Login
          </button>
          <button
            className={`tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
            type="button"
          >
            Register
          </button>
        </div>

        <form onSubmit={submit}>
          {mode === 'register' && (
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
          )}

          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} required />
          </div>

          <div className="field">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} required />
          </div>

          {mode === 'register' && (
            <div className="field">
              <label>Phone (optional)</label>
              <input name="phoneNumber" value={form.phoneNumber} onChange={handle} />
            </div>
          )}

          {error && <div className="error">{error}</div>}

          <button className="btn primary full-width" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
