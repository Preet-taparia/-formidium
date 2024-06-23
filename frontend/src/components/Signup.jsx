import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Signup.module.css'; // Import CSS module

const Signin = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const history = useHistory();

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      // Call API to generate OTP and send it to the email
      const response = await fetch('/api/generate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate OTP');
      }

      // Display OTP sent alert for 5 seconds
      alert('OTP sent to your email. Please check and enter it.');

      // Clear email input after showing the alert
      setEmail('');

      // Automatically show next alert for entering OTP after 5 seconds
      setTimeout(() => {
        const enteredOTP = prompt('Please enter the OTP sent to your email:');
        if (enteredOTP) {
          setOtp(enteredOTP);
          handleVerifyOTP();
        } else {
          alert('OTP entry cancelled or invalid. Please try signing in again.');
        }
      }, 5000);

    } catch (error) {
      console.error('Error generating OTP:', error);
      alert('Failed to generate OTP. Please try again later.');
    }
  };


  const handleAdminSignIn = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:5000/api/admin-login';
    
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('Admin sign-in result:', result);

    // Handle success and redirection
    alert('Admin login successful. Redirecting to Notify Invoices page.');
    history.push('/notify/invoices');
  } catch (error) {
    console.error('Error logging in as admin:', error);
    alert('Invalid credentials. Please try again.');
  }
};

  const handleVerifyOTP = async () => {
    try {
      // Call API to verify OTP
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        throw new Error('Invalid OTP');
      }

      const result = await response.json();
      if (result.message === 'OTP verified successfully') {
        // Update email_verified status in the component state or context if needed
        alert('OTP verified successfully. Redirecting to Connect with MetaMask page.');
        history.push('/connect-meta-mask');
      } else {
        throw new Error('Failed to verify OTP');
      }

    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className={`${styles.container} ${isRightPanelActive ? styles['right-panel-active'] : ''}`} id="container">
      <div className={`${styles['form-container']} ${styles['sign-up-container']}`}>
        {/* User Signin Panel */}
        <form onSubmit={handleSignIn}>
          <h1>User Page</h1>
          <div className={styles['social-container']}>
            <a href="#" className={styles.social}><i className="fab fa-facebook-f"></i></a>
            <a href="#" className={styles.social}><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className={styles.social}><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>Enter your email</span>
          <input className={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <a href="#">Forgot your email?</a>
          <button className={styles.button} type="submit">Sign In</button>
        </form>
      </div>
      <div className={`${styles['form-container']} ${styles['sign-in-container']}`}>
        {/* Admin Signin Panel */}
        <form onSubmit={handleAdminSignIn}>
          <h1>Admin Page</h1>
          <div className={styles['social-container']}>
            <a href="#" className={styles.social}><i className="fab fa-facebook-f"></i></a>
            <a href="#" className={styles.social}><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className={styles.social}><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>Enter your email and password</span>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a href="#">Forgot your password?</a>
          <button className={styles.button} type="submit">Sign In</button>
        </form>
      </div>
      <div className={styles['overlay-container']}>
        <div className={styles.overlay}>
          <div className={`${styles['overlay-panel']} ${styles['overlay-left']}`}>
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className={`${styles.button} ${styles.ghost}`} id="signIn" onClick={handleSignInClick}>Signin Admin</button>
          </div>
          <div className={`${styles['overlay-panel']} ${styles['overlay-right']}`}>
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className={`${styles.button} ${styles.ghost}`} id="signUp" onClick={handleSignUpClick}>Signin User</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
