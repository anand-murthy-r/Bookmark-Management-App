import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
  Divider,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google'; // Using Google Icon for branding feel

const GoogleLoginCard = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Attempting login for:', email);
    // In a real app, you'd navigate or perform API calls here
  };

  return (
    // **Container & Layout**
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card 
        variant="outlined" 
        sx={{ 
          width: '100%', 
          padding: 3, 
          borderRadius: 2, 
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)', 
          textAlign: 'center' 
        }}
      >
        <CardContent>
          {/* **Google-like Branding** */}
          <GoogleIcon sx={{ fontSize: 40, color: '#4285F4', mb: 1 }} />
          <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Use your Google Account
          </Typography>

          {/* **Login Form** */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email or phone"
              name="email"
              autoComplete="email"
              autoFocus
              variant="outlined" // Default MUI style is clean
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // The `label` floats up like in the Google design
            />

            {/* **Simulated Next Button (Google's first step)** */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
              <Link href="#" variant="body2" sx={{ fontWeight: 500, color: '#1a73e8', textDecoration: 'none' }}>
                Forgot email?
              </Link>
              <Button
                type="submit"
                variant="contained"
                sx={{ 
                  textTransform: 'none', 
                  bgcolor: '#1a73e8', 
                  '&:hover': { bgcolor: '#1a73e8' } 
                }}
              >
                Next
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* **Create Account Link** */}
            <Link 
              href="#" 
              variant="body2" 
              sx={{ fontWeight: 500, color: '#1a73e8', textDecoration: 'none', display: 'block' }}
            >
              Create account
            </Link>
          </Box>
        </CardContent>
      </Card>
      {/* **Footer/Help Links (Optional)** */}
      <Box sx={{ width: '100%', maxWidth: '400px', mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          <Link href="#" sx={{ mx: 1 }}>Help</Link>•
          <Link href="#" sx={{ mx: 1 }}>Privacy</Link>•
          <Link href="#" sx={{ mx: 1 }}>Terms</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default GoogleLoginCard;