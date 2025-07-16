
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerList from './CustomerList';
import CustomerDuesPage from './CustomerDuesPage';
import './App.css';


const defaultCustomers = [
  { id: 1, name: '#1' },
  { id: 2, name: '#2' },
];


export default function App() {
  // Load from localStorage or use defaults
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('customers');
    return saved ? JSON.parse(saved) : defaultCustomers;
  });
  const [dues, setDues] = useState(() => {
    const saved = localStorage.getItem('dues');
    return saved ? JSON.parse(saved) : {};
  });


  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);
  useEffect(() => {
    localStorage.setItem('dues', JSON.stringify(dues));
  }, [dues]);

  const addCustomer = (name, phone) => {
    const newCustomer = { id: Date.now(), name, phone };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const addDue = (customerId, due) => {
    setDues(prev => ({
      ...prev,
      [customerId]: [...(prev[customerId] || []), { ...due, id: Date.now(), paid: false }],
    }));
  };

  const markDueAsPaid = (customerId, dueId) => {
    setDues(prev => ({
      ...prev,
      [customerId]: prev[customerId].map(d => d.id === dueId ? { ...d, paid: true } : d),
    }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem('customers');
      localStorage.removeItem('dues');
      setCustomers(defaultCustomers);
      setDues({});
    }
  };

  return (
    <>
      <button onClick={handleReset} style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000, background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', cursor: 'pointer' }}>Reset Data</button>
      <Router>
        <Routes>
          <Route path="/" element={<CustomerList customers={customers} addCustomer={addCustomer} />} />
          <Route path="/customer/:id" element={<CustomerDuesPage customers={customers} dues={dues} addDue={addDue} markDueAsPaid={markDueAsPaid} />} />
        </Routes>
      </Router>
    </>
  );
}
