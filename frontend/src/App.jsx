import React, { useState } from 'react';
// This component implements Sign-In and Sign-Up in a clean, Material Design style.
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
} from '@mui/material';
// Removed GoogleIcon as requested

// Global mock storage key
const AUTH_TOKEN_KEY = 'authToken';
// Backend Configuration
const API_BASE_URL = 'http://10.242.112.190:3000';

// The component containing the authentication interface logic
const GoogleLoginCard = () => {
  // State for user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // State for UI control
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [loginStep, setLoginStep] = useState('email'); // 'email' or 'password' (only for login mode)
  
  // State for status feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Google's branding colors for links and primary buttons
  const primaryBlue = '#1a73e8';

  // --- Core Logic Functions ---

  const storeAuthToken = (token) => {
    // 3. Status 200 (Success) for Sign In: persist the auth token
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    console.log(`Login successful! Auth Token stored: ${token}`);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    const loginUrl = `${API_BASE_URL}/auth/signin`;

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        // Success case (Status 200)
        const data = await response.json();
        const token = data.access_token; // Assuming backend returns { authToken: '...' }
        
        if (token) {
          storeAuthToken(token);
          console.log("Redirecting to protected content...");
        } else {
          setError("Login failed: Authentication token missing in response.");
        }
      } else {
        // Failure case (Status != 200)
        let errorMsg = "Login failed. Check your email and password.";
        try {
            const errorData = await response.json();
            if (errorData.message) {
                errorMsg = errorData.message;
            }
        } catch (e) {
            // Non-JSON error body (e.g., server down or simple text error)
            errorMsg = `Login failed. Server returned status: ${response.status}`;
        }
        setError(errorMsg);
      }
    } catch (e) {
      // Network or other generic error (e.g., DNS resolution, connection timeout)
      console.error("Login Network Error:", e);
      setError("A network error occurred. Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    
    // Client-side mandatory fields check (2. all fields are mandatory)
    if (!username || !email || !password) {
      setError("All fields (Username, Email, Password) are mandatory.");
      setLoading(false);
      return;
    }

    const signupUrl = `${API_BASE_URL}/auth/signup`;

    try {
      const response = await fetch(signupUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 2. Sign up payload format
        body: JSON.stringify({ email, password, username }),
      });

      if (response.status === 200) {
        // Success case (Status 200)
        console.log("Account created successfully. Please sign in now.");
        // Clear fields and switch to login mode after successful signup
        setEmail('');
        setPassword('');
        setUsername('');
        setMode('login');
        setLoginStep('email');
      } else {
        // Failure case (Status != 200): handle "email already exists"
        let errorMsg = "Sign up failed.";
        try {
            const errorData = await response.json();
            // Attempt to detect common "email already exists" messages
            const msg = errorData.message || JSON.stringify(errorData);
            if (msg.includes('email') && msg.includes('exists')) {
                errorMsg = "Email already exists. Please sign in instead.";
            } else {
                errorMsg = msg;
            }
        } catch (e) {
            errorMsg = `Sign up failed. Server returned status: ${response.status}`;
        }
        setError(errorMsg);
      }
    } catch (e) {
      // Network or other generic error
      console.error("Sign Up Network Error:", e);
      setError("A network error occurred. Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (loginStep === 'email') {
        // Sign In Step 1: Email validation
        if (!email.includes('@') || email.length < 5) {
          setError("Enter a valid email address.");
          return;
        }
        setLoginStep('password');
      } else { // loginStep === 'password'
        handleLogin();
      }
    } else { // mode === 'signup'
      handleSignUp();
    }
  };

  // --- Rendering Helpers (Unchanged UI logic) ---

  const renderAuthForm = () => {
    if (mode === 'login') {
      return (
        // LOGIN MODE
        <>
          <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
            {loginStep === 'email' ? 'Sign in to your account' : 'Welcome back'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {loginStep === 'email' 
              ? 'Enter your email to continue' 
              : `Signing in as ${email}`
            }
          </Typography>

          {loginStep === 'email' && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              variant="outlined"
              value={email}
              onChange={(e) => {setEmail(e.target.value); setError('');}}
              error={!!error}
              helperText={error || " "}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          )}

          {loginStep === 'password' && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              variant="outlined"
              value={password}
              onChange={(e) => {setPassword(e.target.value); setError('');}}
              error={!!error}
              helperText={error || 
                  <Link 
                      href="#" 
                      variant="body2" 
                      sx={{ fontWeight: 500, color: primaryBlue, textDecoration: 'none' }}
                  >
                      Forgot password?
                  </Link>
              }
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          )}
        </>
      );
    } else {
      return (
        // SIGN UP MODE
        <>
          <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
            Create Your Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            All fields are mandatory.
          </Typography>

          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            variant="outlined"
            value={username}
            onChange={(e) => {setUsername(e.target.value); setError('');}}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email-signup"
            label="Email"
            name="email"
            autoComplete="email"
            variant="outlined"
            value={email}
            onChange={(e) => {setEmail(e.target.value); setError('');}}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password-signup"
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            variant="outlined"
            value={password}
            onChange={(e) => {setPassword(e.target.value); setError('');}}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </>
      );
    }
  };

  const renderActionButtons = () => {
    if (mode === 'login') {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 1 }}>
          <Link 
            href="#" 
            variant="body2" 
            sx={{ fontWeight: 500, color: primaryBlue, textDecoration: 'none' }}
            onClick={() => {
              setMode('signup'); 
              setError('');
              setEmail(''); 
              setPassword('');
              setUsername('');
            }}
          >
            Create account
          </Link>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {loginStep === 'password' && (
              <Button
                onClick={() => {setLoginStep('email'); setError(''); setPassword('');}}
                variant="text"
                sx={{ textTransform: 'none', color: primaryBlue }}
                disabled={loading}
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              sx={{ 
                textTransform: 'none', 
                bgcolor: primaryBlue, 
                '&:hover': { bgcolor: '#1765c9' }, 
                minWidth: '80px',
                borderRadius: '24px'
              }}
              disabled={loading}
            >
              {loading ? '...' : (loginStep === 'email' ? 'Next' : 'Sign In')}
            </Button>
          </Box>
        </Box>
      );
    } else { // mode === 'signup'
      return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 1 }}>
          <Button
            onClick={() => {setMode('login'); setError(''); setEmail(''); setPassword(''); setUsername(''); setLoginStep('email');}}
            variant="text"
            sx={{ textTransform: 'none', color: primaryBlue }}
            disabled={loading}
          >
            Sign in instead
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{ 
              textTransform: 'none', 
              bgcolor: primaryBlue, 
              '&:hover': { bgcolor: '#1765c9' }, 
              minWidth: '80px',
              borderRadius: '24px'
            }}
            disabled={loading}
          >
            {loading ? '...' : 'Sign Up'}
          </Button>
        </Box>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <Container 
        component="main" 
        maxWidth="xs" 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '100%' 
        }}
      >
        <Card 
          variant="outlined" 
          sx={{ 
            width: '100%', 
            padding: { xs: 3, sm: 4 }, 
            borderRadius: 3, 
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', 
            textAlign: 'center',
            backgroundColor: 'white',
            maxWidth: 450 
          }}
        >
          <CardContent sx={{ '&:last-child': { pb: 2 } }}>
            {/* Logo/Branding spot (now empty) */}
            
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              
              {renderAuthForm()}
              
              {/* Centralized Error Display */}
              <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center', height: '1.2rem' }}>
                {error}
              </Typography>

              {/* Action Buttons (Submit, Back, Create Account/Sign In Instead) */}
              {renderActionButtons()}

            </Box>
            
            {/* Optional Guest/Learn More link only shown in login step 2 for user context */}
            {mode === 'login' && loginStep === 'password' && (
              <Typography variant="body2" color="text.secondary" align="left" sx={{ mt: 2, mb: 1 }}>
                Not your computer? Use a guest window to sign in. 
                <Link href="#" sx={{ color: primaryBlue, textDecoration: 'none', ml: 0.5 }}>Learn more</Link>
              </Typography>
            )}

          </CardContent>
        </Card>

        {/* **Footer/Help Links (Below the card)** */}
        <Box sx={{ width: '100%', maxWidth: '450px', mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                English (United States)
            </Typography>
            <Box>
                <Link href="#" variant="caption" sx={{ mx: 1, color: 'text.secondary', textDecoration: 'none' }}>Help</Link>
                <Link href="#" variant="caption" sx={{ mx: 1, color: 'text.secondary', textDecoration: 'none' }}>Privacy</Link>
                <Link href="#" variant="caption" sx={{ mx: 1, color: 'text.secondary', textDecoration: 'none' }}>Terms</Link>
            </Box>
        </Box>
      </Container>
    </div>
  );
};

export default GoogleLoginCard;
