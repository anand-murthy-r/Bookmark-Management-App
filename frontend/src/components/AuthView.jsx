import React, { useState } from 'react';
import axios from 'axios';

// ⚠️ IMPORTANT: Replace this with your actual backend URL
const API_BASE_URL = '/api'; 

const AuthView = () => {
  // State to toggle between 'signin' and 'signup' mode
  const [isSignInMode, setIsSignInMode] = useState(true);

  // State for form fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '', // Only required for signup
  });

  // State for displaying messages to the user
  const [message, setMessage] = useState('');

  // State for storing the access token (for sign-in success)
  const [accessToken, setAccessToken] = useState(null); 

  // --- Handlers ---

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Processing...'); // Clear previous message
    
    // Determine the endpoint and the data to send
    const endpoint = isSignInMode ? '/auth/signin' : '/auth/signup';
    
    let dataToSend = {
      email: formData.email,
      password: formData.password,
    };

    if (!isSignInMode) {
      // Add username only for signup
      dataToSend = { ...dataToSend, username: formData.username };
    }

    // --- API Call ---
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, dataToSend);

      if (isSignInMode) {
        // Successful Sign In
        const token = response.data.accesstoken || response.data.accessToken;
        setAccessToken(token); 
        // ⚠️ Store the token securely (e.g., localStorage or secure cookie)
        localStorage.setItem('authToken', token);
        setMessage(`✅ Sign-in successful! Token stored. Hello ${formData.email}!`);
        console.log('Access Token:', token);
        // You would typically redirect the user to a dashboard here
      } else {
        // Successful Sign Up
        setMessage('✅ Sign-up successful! Please sign in now.');
        // Optionally switch to sign-in mode immediately
        setIsSignInMode(true);
      }
    } catch (error) {
      // Handle API errors
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      setMessage(`❌ Error: ${errorMessage}`);
      setAccessToken(null);
      console.error("Auth error:", error.response || error);
    }
  };
  
  // --- Render Functions ---

  const renderUsernameField = () => {
    if (isSignInMode) return null; // Hide in sign-in mode
    
    return (
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required={!isSignInMode} // Required only for signup
        />
      </div>
    );
  };

  return (
    <div className="auth-container">
      <h1>{isSignInMode ? 'Sign In' : 'Sign Up'}</h1>
      
      {/* Switch Button */}
      <button 
        onClick={() => {
          setIsSignInMode(!isSignInMode);
          setMessage(''); // Clear message when switching
          // Optional: Clear form data when switching
          setFormData({ email: '', password: '', username: '' }); 
        }}
        className="toggle-button"
      >
        {isSignInMode 
          ? "Need an account? Sign Up" 
          : "Already have an account? Sign In"
        }
      </button>

      {/* Auth Form */}
      <form onSubmit={handleSubmit}>
        
        {renderUsernameField()}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">
          {isSignInMode ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      
      {/* Message Area */}
      {message && <p className="auth-message">{message}</p>}
      
      {/* Optional: Display token status for verification */}
      {accessToken && (
        <p className="token-status">
          Token: **{accessToken.substring(0, 10)}...** (Stored in localStorage)
        </p>
      )}
    </div>
  );
};

export default AuthView;