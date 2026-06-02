import React, { useState } from 'react';
import {
  Paper,
  Button,
  TextField,
  IconButton,
  Typography,
  Alert,
  Box,
  InputAdornment,
  CircularProgress,
  Divider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { Link, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userSlice';
import Cookies from 'js-cookie';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [data, setData] = useState({
    email: '',
    password: '',
  });

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
      const result = await dispatch(loginUser(data)).unwrap();

      if (result?.data?.token) {
        Cookies.set('access-token', result.data.token);
        setShowSuccessAlert(true);

        setTimeout(() => {
          navigate('/home');
          setShowSuccessAlert(false);
        }, 1500);
      }
    } catch (err) {
      console.error('Login failed:', err);
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
      sx={{
        background: 'linear-gradient(180deg, #f0f4ff 0%, #e8eef9 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(25, 118, 210, 0.08)',
          top: '-100px',
          right: '-100px',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(245, 0, 87, 0.05)',
          bottom: '-80px',
          left: '-80px',
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          px: { xs: 2, sm: 3 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
            gap: 4,
            alignItems: 'center',
          }}
        >
          {/* Left Section - Branding */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 3,
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 24px 64px rgba(15, 23, 42, 0.08)',
              border: '1px solid rgba(255,255,255,0.5)',
              animation: 'slideInLeft 0.6s ease-out',
              '@keyframes slideInLeft': {
                from: {
                  opacity: 0,
                  transform: 'translateX(-40px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #1976d2 0%, #f50057 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: '1.1rem', lineHeight: 1.6, maxWidth: 520 }}
              >
                Log in to your account and explore exclusive features, manage your orders, and access personalized recommendations.
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'grid', gap: 2 }}>
              {[
                { icon: '✓', text: 'Fast and secure authentication' },
                { icon: '✓', text: 'Manage your orders effortlessly' },
                { icon: '✓', text: 'Access exclusive deals and offers' },
              ].map((item, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    color: 'text.primary',
                    fontWeight: 500,
                    animation: `slideInLeft 0.6s ease-out ${idx * 0.1}s both`,
                    '@keyframes slideInLeft': {
                      from: {
                        opacity: 0,
                        transform: 'translateX(-20px)',
                      },
                      to: {
                        opacity: 1,
                        transform: 'translateX(0)',
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1976d2 0%, #f50057 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.icon}
                  </Box>
                  {item.text}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Right Section - Login Form */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 24px 64px rgba(15, 23, 42, 0.12)',
              border: '1px solid rgba(255,255,255,0.5)',
              animation: 'slideInRight 0.6s ease-out',
              '@keyframes slideInRight': {
                from: {
                  opacity: 0,
                  transform: 'translateX(40px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          >
            {/* Header */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1976d2 0%, #f50057 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                  animation: 'bounce 2s ease-in-out infinite',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                  },
                }}
              >
                <LoginIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}
              >
                Sign In
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Enter your credentials to access your account
              </Typography>
            </Box>

            {/* Alerts */}
            {showSuccessAlert && (
              <Alert
                icon={<CheckCircleIcon fontSize="inherit" />}
                severity="success"
                sx={{
                  mb: 2,
                  animation: 'slideDown 0.4s ease-out',
                  '@keyframes slideDown': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(-20px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                Login successful! Redirecting...
              </Alert>
            )}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  animation: 'slideDown 0.4s ease-out',
                  '@keyframes slideDown': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(-20px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                {error}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2.5 }}>
              {/* Email Field */}
              <Box>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon
                          sx={{
                            color: focusedField === 'email' ? '#1976d2' : '#999',
                            transition: 'color 0.3s ease',
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 8px 24px rgba(25, 118, 210, 0.2)',
                      },
                    },
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon
                          sx={{
                            color: focusedField === 'password' ? '#1976d2' : '#999',
                            transition: 'color 0.3s ease',
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          disabled={loading}
                          sx={{
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 8px 24px rgba(25, 118, 210, 0.2)',
                      },
                    },
                  }}
                />
              </Box>

              {/* Login Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.75,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  mt: 1,
                  '&:hover:not(:disabled)': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                    boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active:not(:disabled)': {
                    transform: 'translateY(0)',
                  },
                  '&:disabled': {
                    opacity: 0.7,
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Links */}
              <Box sx={{ display: 'grid', gap: 1.5, mt: 1 }}>
                <Typography variant="body2" align="center">
                  <Link
                    to="/forgot-password"
                    style={{
                      color: '#1976d2',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      borderBottom: '2px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderBottomColor = '#1976d2';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderBottomColor = 'transparent';
                    }}
                  >
                    Forgot your password?
                  </Link>
                </Typography>

                <Divider />

                <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
                  Don't have an account?{' '}
                  <Link
                    to="/sign-up"
                    style={{
                      color: '#f50057',
                      fontWeight: 700,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.textDecoration = 'none';
                    }}
                  >
                    Create Account
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;

