
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CustomerDues.css';

// Predefined product list
const DEFAULT_PRODUCT_LIST = [
  'Rice',
  'Wheat',
  'Sugar',
  'Oil',
  'Salt',
  'Tea',
  'Soap',
  'Shampoo',
  'Biscuits',
  'Milk',
];

export default function CustomerDuesPage({ customers, dues, addDue, markDueAsPaid }) {
  const { id } = useParams();
  const customerId = Number(id);
  const customer = customers.find(c => c.id === customerId);
  const customerName = customer ? customer.name : 'Customer';
  const customerDues = dues[customerId] || [];
  const [form, setForm] = useState({ price: '', date: '' });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productList, setProductList] = useState(DEFAULT_PRODUCT_LIST);
  const [newProduct, setNewProduct] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductToggle = (product) => {
    setSelectedProducts(prev =>
      prev.includes(product)
        ? prev.filter(p => p !== product)
        : [...prev, product]
    );
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const prod = newProduct.trim();
    if (!prod || productList.includes(prod)) return;
    setProductList(prev => [...prev, prod]);
    setSelectedProducts(prev => [...prev, prod]);
    setNewProduct('');
  };

  const handleAddDue = (e) => {
    e.preventDefault();
    if (selectedProducts.length === 0 || !form.price) return;
    selectedProducts.forEach(product => {
      addDue(customerId, { name: product, price: form.price, date: form.date });
    });
    setForm({ price: '', date: '' });
    setSelectedProducts([]);
  };

  const total = customerDues
    .filter(due => !due.paid)
    .reduce((sum, due) => sum + Number(due.price), 0);

  const handleSendWhatsApp = () => {
    if (!customer?.phone) {
      alert('No phone number for this customer.');
      return;
    }
    const unpaid = customerDues.filter(due => !due.paid);
    if (unpaid.length === 0) {
      alert('No unpaid dues to send.');
      return;
    }
    const message = encodeURIComponent(
      `Hello ${customer.name}, your current dues:\n` +
      unpaid.map(d => `• ${d.name}: ₹${d.price}${d.date ? ` (${d.date})` : ''}`).join('\n') +
      '\nPlease pay soon.'
    );
    const url = `https://wa.me/${customer.phone.replace('+', '')}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="dues-container">
      <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>&larr; Back to Customers</Link>
      <h2>{customerName}'s Dues</h2>
      {customer?.phone && (
        <button onClick={handleSendWhatsApp} style={{ marginBottom: '1rem', background: '#25d366', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Send Dues via WhatsApp
        </button>
      )}
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontWeight: 'bold' }}>Select Products:</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
          {productList.map(product => (
            <label key={product} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <input
                type="checkbox"
                checked={selectedProducts.includes(product)}
                onChange={() => handleProductToggle(product)}
              />
              {product}
            </label>
          ))}
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Add new product"
            value={newProduct}
            onChange={e => setNewProduct(e.target.value)}
          />
          <button type="button" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '0.3rem 0.7rem', cursor: 'pointer' }} onClick={handleAddProduct}>
            Add
          </button>
        </div>
      </div>
      <form onSubmit={handleAddDue} className="dues-form" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
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
