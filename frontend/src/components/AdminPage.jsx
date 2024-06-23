import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Typography,
} from '@mui/material';

const AdminPage = () => {
  const location = useLocation();
  const initialData = location.state?.invoice || {
    recipientAddress: '',
    companyName: '',
    cryptocurrency: '',
    dueDate: '',
    description: '',
    companyEmail: '',
    invoiceCategory: '',
    paymentDue: '', // Adding paymentDue field
  };

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (location.state?.invoice) {
      setFormData(location.state.invoice);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/invoices', formData);
      alert('Invoice created successfully');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper style={{ padding: '20px', maxWidth: '600px', width: '100%', borderRadius: '25px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom style={{ fontFamily: 'Roboto', fontWeight: 700 }}>
          Create Invoice
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Recipient Address"
                name="recipientAddress"
                value={formData.recipientAddress}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ style: { borderRadius: '20px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ style: { borderRadius: '20px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Cryptocurrency</InputLabel>
                <Select
                  name="cryptocurrency"
                  value={formData.cryptocurrency}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ style: { borderRadius: '20px' } }}
                >
                  <MenuItem value="">Select Cryptocurrency</MenuItem>
                  <MenuItem value="Bitcoin">Bitcoin</MenuItem>
                  <MenuItem value="Ethereum">Ethereum</MenuItem>
                  <MenuItem value="Litecoin">Litecoin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Due Date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{ style: { borderRadius: '20px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                multiline
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                InputProps={{ style: { borderRadius: '20px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company Email"
                type="email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ style: { borderRadius: '20px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Invoice Category"
                name="invoiceCategory"
                value={formData.invoiceCategory}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ style: { borderRadius: '20px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Payment Due"
                name="paymentDue"
                value={formData.paymentDue}
                onChange={handleChange}
                fullWidth
                InputProps={{ style: { borderRadius: '20px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Create Invoice
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default AdminPage;
