import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerDues.css';

export default function CustomerList({ customers, addCustomer }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    addCustomer(name.trim(), phone.trim());
    setName('');
    setPhone('');
  };

  return (
    <div className="dues-container">
      <h2 style={{ marginBottom: '0.5rem' }}>Hello <span style={{ color: '#4caf50' }}>Sagar</span>!</h2>
      <h3 style={{ marginTop: 0 }}>Customers</h3>
      <form onSubmit={handleAddCustomer} className="dues-form">
        <input
          placeholder="Customer Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Phone Number (+91...)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <button type="submit">Add Customer</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {customers.map(c => (
          <li key={c.id}>
            <button
              style={{
                background: '#1976d2', color: '#fff', border: 'none', borderRadius: 5, padding: '0.7rem 1.2rem', margin: '0.5rem 0', width: '100%', textAlign: 'left', fontSize: '1rem', cursor: 'pointer'
              }}
              onClick={() => navigate(`/customer/${c.id}`)}
            >
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
