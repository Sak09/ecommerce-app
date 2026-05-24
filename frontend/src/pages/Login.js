import React, { useContext, useState } from 'react';
import {
  Paper,
  Button,
  Grid2,
  TextField,
  IconButton,
  Typography,
  Alert,
  Box,
  InputAdornment,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import summaryapi from '../common/index';
import CheckIcon from '@mui/icons-material/Check';
import context from '../context';
import Cookies from 'js-cookie';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonEnlarged, setIsButtonEnlarged] = useState(false);
  const [showSuccessalert, setShowsuccessalert] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { fetchUserDetails } = useContext(context);

  const handleLoginClick = () => {
    setIsButtonEnlarged(true);
    setTimeout(() => setIsButtonEnlarged(false), 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataResponse = await fetch(summaryapi.login.url, {
        method: summaryapi.login.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const dataApi = await dataResponse.json();
      Cookies.set('access-token', dataApi.data.token);

      if (dataApi.success) {
        setShowsuccessalert(true);
        if (fetchUserDetails) await fetchUserDetails();
        setTimeout(() => {
          navigate('/');
          setShowsuccessalert(false);
        }, 1500);
      } else {
        console.error('Login failed:', dataApi.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      minHeight="calc(100vh - 210px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={6}
      sx={{ bgcolor: '#f4f7ff' }}
    >
      <Box width="100%" maxWidth={460} px={{ xs: 2, sm: 3 }}>
        {showSuccessalert && (
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" sx={{ mb: 2 }}>
            Login successful!
          </Alert>
        )}

        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            boxShadow: '0 16px 40px rgba(16,24,40,0.08)',
            bgcolor: '#ffffff',
          }}
        >
          <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            Access your account and manage orders quickly.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid2 container spacing={2}>
              <Grid2 item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  value={data.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid2>
              <Grid2 item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={data.password}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid2>
              <Grid2 item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleLoginClick}
                  sx={{
                    mt: 1.5,
                    py: 1.5,
                    transition: 'transform 0.25s ease',
                    transform: isButtonEnlarged ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  Login
                </Button>
              </Grid2>
              <Grid2 item xs={12}>
                <Typography variant="body2" textAlign="center">
                  <Link to="/forgot-password" style={{ color: '#1976d2' }}>
                    Forgot password?
                  </Link>
                </Typography>
                <Typography variant="body2" textAlign="center" mt={1}>
                  Don&apos;t have an account?{' '}
                  <Link to="/sign-up" style={{ color: '#1976d2' }}>
                    Sign up
                  </Link>
                </Typography>
              </Grid2>
            </Grid2>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
