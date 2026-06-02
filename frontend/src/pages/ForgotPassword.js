import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, resetPassword } from '../redux/userSlice';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, resetSuccess, resetMessage } = useSelector((state) => state.user);
  
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: Reset
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [codeSent, setCodeSent] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      alert('Please enter your email');
      return;
    }

    try {
      const result = await dispatch(forgotPassword(email)).unwrap();
      if (result.success) {
        setCodeSent(true);
        setStep(2);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!resetCode || !newPassword || !confirmPassword) {
      alert('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      const result = await dispatch(
        resetPassword({
          email,
          resetToken: resetCode,
          newPassword,
          confirmPassword,
        })
      ).unwrap();

      if (result.success) {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setCodeSent(false);
  };

  if (resetSuccess) {
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
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 24px 64px rgba(15, 23, 42, 0.12)',
            maxWidth: 500,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
              animation: 'bounce 2s ease-in-out infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
              },
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Password Reset Successfully!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {resetMessage || 'Your password has been reset. Redirecting to login...'}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/login')}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
            }}
          >
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }

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
                Reset Password
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: '1.1rem', lineHeight: 1.6, maxWidth: 520 }}
              >
                {step === 1
                  ? 'Enter your email address and we\'ll send you a code to reset your password.'
                  : 'Enter the reset code and your new password to regain access to your account.'}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'grid', gap: 2 }}>
              {[
                { icon: '✓', text: 'Secure password reset process' },
                { icon: '✓', text: 'Reset code expires in 10 minutes' },
                { icon: '✓', text: 'Immediate access after reset' },
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

          {/* Right Section - Form */}
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
                  width: 70,
                  height: 70,
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
                {step === 1 ? (
                  <EmailIcon sx={{ fontSize: 36, color: 'white' }} />
                ) : (
                  <KeyIcon sx={{ fontSize: 36, color: 'white' }} />
                )}
              </Box>
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}
              >
                {step === 1 ? 'Find Your Account' : 'Reset Password'}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {step === 1
                  ? 'Enter your email to receive a reset code'
                  : 'Enter the code and your new password'}
              </Typography>
            </Box>

            {/* Alerts */}
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
            {step === 1 ? (
              <Box component="form" onSubmit={handleEmailSubmit} sx={{ display: 'grid', gap: 2.5 }}>
                {codeSent && (
                  <Alert severity="success" sx={{ mb: 1 }}>
                    Reset code sent to your email!
                  </Alert>
                )}

                <Box>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    mt: 1,
                    '&:hover:not(:disabled)': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                      boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active:not(:disabled)': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Reset Code'}
                </Button>

                <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 1 }}>
                  Remember your password?{' '}
                  <Link
                    to="/login"
                    style={{
                      color: '#1976d2',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Login here
                  </Link>
                </Typography>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleResetSubmit} sx={{ display: 'grid', gap: 2.5 }}>
                {/* Reset Code */}
                <Box>
                  <TextField
                    fullWidth
                    label="Reset Code"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onFocus={() => setFocusedField('code')}
                    onBlur={() => setFocusedField(null)}
                    required
                    disabled={loading}
                    placeholder="Enter 6-digit code"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon
                            sx={{
                              color: focusedField === 'code' ? '#1976d2' : '#999',
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

                {/* New Password */}
                <Box>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
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

                {/* Confirm Password */}
                <Box>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    required
                    disabled={loading}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon
                            sx={{
                              color: focusedField === 'confirmPassword' ? '#1976d2' : '#999',
                              transition: 'color 0.3s ease',
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={loading}
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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

                {/* Reset Button */}
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
                    mt: 1,
                    '&:hover:not(:disabled)': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                      boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active:not(:disabled)': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Reset Password'}
                </Button>

                {/* Back Button */}
                <Button
                  onClick={handleBackToEmail}
                  disabled={loading}
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    color: '#1976d2',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                    },
                  }}
                >
                  Back to Email
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
