import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import UserCard from './UserCard';
import {
  Typography,
  Grid,
  Button,
  CircularProgress,
  TextField,
  Box,
  Paper,
} from '@mui/material';
import SadImage from './sad.png'; // Adjust the path as per your project structure

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotFound, setShowNotFound] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/invoices');
        console.log('Response:', response.data); // Log response to check data
        setInvoices(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setError('Error fetching invoices');
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleMakeInvoiceClick = (invoice) => {
    history.push({
      pathname: '/admin/register',
      state: { invoice },
    });
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.companyEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingInvoices = filteredInvoices.filter((invoice) => invoice.isPending);
  const completedInvoices = filteredInvoices.filter((invoice) => !invoice.isPending);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowNotFound(false); // Reset not found message when search query changes
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowNotFound(false); // Reset not found message when clearing search
  };
  

  // Show "Oops! Not Found" message and sad image when no results found
  if (filteredInvoices.length === 0 && searchQuery !== '' && !loading && !error) {
    return (
      <Paper style={{ padding: '20px', backgroundColor: '#fff', maxHeight: '100vh', fontFamily: 'Roboto' }}>
        <Typography variant="h3" style={{ color: '#333', marginBottom: '20px', textAlign: 'center', fontWeight: 500 }}>Invoices</Typography>
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mb={3}>
          <div className="search-container" style={{ display: 'flex', alignItems: 'center'}}>
            <TextField
              type="text"
              placeholder="Search by Email"
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
              className="search-input"
              style={{ borderRadius: '20px', marginRight: '15px', width: '300px' }}
              InputProps={{
                style: { borderRadius: '20px' }
              }}
            />
            <Button
              onClick={handleClearSearch}
              variant="contained"
              color="primary"
              className="clear-button"
              style={{ borderRadius: '10px', backgroundColor: '#aa2bff' }}
            >
              Clear
            </Button>
          </div>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" style={{ marginTop: '50px' }}>
          <Typography variant="h5" style={{ color: '#333', marginBottom: '10px', textAlign: 'center', fontWeight: 500 }}>Oops! Not Found</Typography>
          <img src={SadImage} alt="Sad Face" style={{ width: '150px', height: '150px', marginBottom: '20px' }} />
        </Box>
      </Paper>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  if (error) {
    return <Typography variant="h4" style={{ color: '#f00', textAlign: 'center', marginTop: '20px' }}>{error}</Typography>;
  }

  return (
    <Paper style={{ padding: '20px', backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'Roboto' }}>
      <Typography variant="h3" style={{ color: '#333', marginBottom: '20px', textAlign: 'center', fontWeight: 500 }}>Invoices</Typography>
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mb={3}>
        <div className="search-container" style={{ display: 'flex', alignItems: 'center'}}>
          <TextField
            type="text"
            placeholder="Search by Email"
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            className="search-input"
            style={{ borderRadius: '20px', marginRight: '15px', width: '300px' }}
            InputProps={{
              style: { borderRadius: '20px' }
            }}
          />
          <Button
            onClick={handleClearSearch}
            variant="contained"
            color="primary"
            className="clear-button"
            style={{ borderRadius: '10px', backgroundColor: '#aa2bff' }}
          >
            Clear
          </Button>
        </div>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" style={{ color: '#333', marginBottom: '10px', textAlign: 'center', fontWeight: 500 }}>Pending Invoices</Typography>
          <Box style={{ maxHeight: '490px', overflowY: 'scroll', paddingRight: '10px', backgroundColor: '#999', borderRadius: '20px', padding: '10px', marginRight:'20px' }}>
            {pendingInvoices.map((invoice, index) => (
              <Box key={index} mb={2}>
                <UserCard user={invoice} handleMakeInvoiceClick={handleMakeInvoiceClick} />
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" style={{ color: '#333', marginBottom: '10px', textAlign: 'center', fontWeight: 500 }}>Completed Invoices</Typography>
          <Box style={{ maxHeight: '490px', overflowY: 'scroll', paddingRight: '10px', backgroundColor: '#999', borderRadius: '20px', padding: '10px', marginLeft:'20px' }}>
            {completedInvoices.map((invoice, index) => (
              <Box key={index} mb={2}>
                <UserCard user={invoice} handleMakeInvoiceClick={handleMakeInvoiceClick} />
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InvoiceList;
