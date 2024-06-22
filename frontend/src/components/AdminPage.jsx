// src/components/AdminPage.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    recipientAddress: '',
    companyName: '',
    cryptocurrency: '',
    dueDate: '',
    description: '',
    companyEmail: '',
    invoiceCategory: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/invoices', formData);
      console.log('Invoice created:', response.data);
      alert('Invoice created successfully');
      // Optionally reset form fields after successful submission
      setFormData({
        recipientAddress: '',
        companyName: '',
        cryptocurrency: '',
        dueDate: '',
        description: '',
        companyEmail: '',
        invoiceCategory: '',
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice');
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <h2>Make an Invoice</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipient Address</label>
          <input type="text" name="recipientAddress" value={formData.recipientAddress} onChange={handleChange} required />
        </div>
        <div>
          <label>Company Name</label>
          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
        </div>
        <div>
          <label>Cryptocurrency</label>
          <select name="cryptocurrency" value={formData.cryptocurrency} onChange={handleChange} required>
            <option value="">Select Cryptocurrency</option>
            <option value="Bitcoin">Bitcoin</option>
            <option value="Ethereum">Ethereum</option>
            <option value="Litecoin">Litecoin</option>
          </select>
        </div>
        <div>
          <label>Due Date</label>
          <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        <div>
          <label>Company Email</label>
          <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} required />
        </div>
        <div>
          <label>Invoice Category</label>
          <input type="text" name="invoiceCategory" value={formData.invoiceCategory} onChange={handleChange} required />
        </div>
        <button type="submit">Register Invoice</button>
      </form>
    </div>
  );
};

export default AdminPage;
