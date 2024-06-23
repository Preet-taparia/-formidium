import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#1f1f1f', // Dark grey background
  color: '#fff',
});

const StyledButton = styled(Button)({
  background: 'linear-gradient(to right, #007bff 50%, transparent 50%)', // Blue gradient background
  backgroundSize: '200% 100%',
  transition: 'background-position 0.5s',
  color: '#fff',
  '&:hover': {
    backgroundPosition: '100% 0',
    color: '#fff',
  },
});

const UserPage = () => {
  const location = useLocation();
  const history = useHistory();

  // Mocking admin email for demonstration
  const adminEmail = 'kanishktiwari11a@gmail.com';

  // Check if admin email matches entered email, else redirect
  const userEmail = location.state?.userEmail;
  if (!userEmail || userEmail !== adminEmail) {
    history.push('/'); // Redirect to home or login page
    return null; // Prevent rendering if redirected
  }

  // Function to handle MetaMask connect
  const handleConnectMetaMask = () => {
    // Mocking MetaMask integration with user's email
    const userMetaMaskAddress = `MetaMask address for ${userEmail}`;
    console.log('MetaMask address:', userMetaMaskAddress);
    // Replace with actual MetaMask integration logic
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Welcome User
      </Typography>
      <StyledButton onClick={handleConnectMetaMask}>
        Connect with MetaMask
      </StyledButton>
    </StyledContainer>
  );
};

export default UserPage;
