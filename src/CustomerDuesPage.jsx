
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CustomerDues.css';

export default function CustomerDuesPage({ customers, dues, addDue, markDueAsPaid }) {
  const { id } = useParams();
  const customerId = Number(id);
  const customer = customers.find(c => c.id === customerId);
  const customerName = customer ? customer.name : 'Customer';
  const customerDues = dues[customerId] || [];
  const [form, setForm] = useState({ name: '', price: '', date: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddDue = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    addDue(customerId, { ...form });
    setForm({ name: '', price: '', date: '' });
  };

  const total = customerDues
    .filter(due => !due.paid)
    .reduce((sum, due) => sum + Number(due.price), 0);

  return (
    <div className="dues-container">
      <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>&larr; Back to Customers</Link>
      <h2>{customerName}'s Dues</h2>
      <form onSubmit={handleAddDue} className="dues-form">
        <input name="name" placeholder="Due Name/Description" value={form.name} onChange={handleChange} />
        <input name="price" type="number" placeholder="Amount" value={form.price} onChange={handleChange} />
        <input name="date" type="date" value={form.date} onChange={handleChange} />
        <button type="submit">Add Due</button>
      </form>
      <div style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        Total: ₹{total}
      </div>
      <table className="dues-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount (₹)</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customerDues.map(due => (
            <tr key={due.id} style={due.paid ? { opacity: 0.5, textDecoration: 'line-through' } : {}}>
              <td>{due.name}</td>
              <td>{due.price}</td>
              <td>{due.date}</td>
              <td>
                {!due.paid && (
                  <button style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4, padding: '0.3rem 0.7rem', cursor: 'pointer' }} onClick={() => markDueAsPaid(customerId, due.id)}>
                    Mark as Paid
                  </button>
                )}
                {due.paid && <span style={{ color: '#4caf50', fontWeight: 'bold' }}>Paid</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
