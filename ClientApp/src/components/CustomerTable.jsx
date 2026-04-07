export default function CustomerTable({ customers, onEdit, onDelete, onOrder }) {
  if (!customers.length)
    return <p className="empty">No customers yet. Click "Add Customer" to begin.</p>;

  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Added</th><th></th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td className="muted">{c.id}</td>
              <td><strong>{c.firstName} {c.lastName}</strong></td>
              <td>{c.email}</td>
              <td>{c.phoneNumber || '—'}</td>
              <td className="muted">{new Date(c.createdAt).toLocaleDateString()}</td>
              <td className="actions">
                <button className="btn sm order" onClick={() => onOrder(c)}>Order</button>
                <button className="btn sm edit" onClick={() => onEdit(c)}>Edit</button>
                <button className="btn sm del" onClick={() => onDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
