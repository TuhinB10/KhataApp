import React, { useState } from 'react';
import './CustomerDues.css';

const initialCustomers = [
  // Example data, replace with API/backend integration
  { id: 1, name: 'Amit Kumar', phone: '+911234567890', due: 500 },
  { id: 2, name: '#2', phone: '+919876543210', due: 1200 },
];

export default function CustomerDues() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [form, setForm] = useState({ name: '', phone: '', due: '' });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.due) return;
    if (editingId) {
      setCustomers(customers.map(c => c.id === editingId ? { ...c, ...form, due: Number(form.due) } : c));
      setEditingId(null);
    } else {
      setCustomers([
        ...customers,
        { ...form, id: Date.now(), due: Number(form.due) },
      ]);
    }
    setForm({ name: '', phone: '', due: '' });
  };

  const handleEdit = (customer) => {
    setForm({ name: customer.name, phone: customer.phone, due: customer.due });
    setEditingId(customer.id);
  };

  const handleDelete = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const handleSendWhatsApp = (customer) => {
    const message = encodeURIComponent(`Hello ${customer.name}, your current due is ₹${customer.due}. Please pay soon.`);
    const url = `https://wa.me/${customer.phone.replace('+', '')}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="dues-container">
      <h2>Customer Dues Management</h2>
      <form onSubmit={handleAddOrUpdate} className="dues-form">
        <input name="name" placeholder="Customer Name" value={form.name} onChange={handleChange} />
        <input name="phone" placeholder="Phone (+91...)" value={form.phone} onChange={handleChange} />
        <input name="due" type="number" placeholder="Due Amount" value={form.due} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update' : 'Add'} Due</button>
        {editingId && <button type="button" onClick={() => { setForm({ name: '', phone: '', due: '' }); setEditingId(null); }}>Cancel</button>}
      </form>
      <table className="dues-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Due (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.due}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
                <button onClick={() => handleSendWhatsApp(c)}>Send WhatsApp</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
