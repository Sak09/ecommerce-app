import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import summaryapi from '../common';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, uploadProfilePic } from '../redux/userSlice';
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  Avatar,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  LinearProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  const [data, setData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    profilePic: '',
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }

    try {
      setUploadProgress(30);
      
      const result = await dispatch(uploadProfilePic(file)).unwrap();
      
      setUploadProgress(70);

      if (result.success) {
        setUploadError('');
        setData((prev) => ({
          ...prev,
          profilePic: result.fileUrl,
        }));
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
      } else {
        setUploadError(result.message || 'Failed to upload the profile picture.');
        setUploadProgress(0);
      }
    } catch (err) {
      console.error('Error:', err);
      setUploadError(err || 'An error occurred while uploading the profile picture.');
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.profilePic) {
      setUploadError('Please upload a profile picture before submitting.');
      return;
    }

    if (data.password !== data.confirmPassword) {
      setUploadError('Passwords do not match. Please check and try again.');
      return;
    }

    try {
      const result = await dispatch(signupUser({
        email: data.email,
        password: data.password,
        name: data.name,
        profilePic: data.profilePic,
      })).unwrap();

      if (result.success) {
        alert(result.message || 'Account created successfully!');
        navigate('/login');
      }
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  const isFormValid = data.email && data.password && data.confirmPassword && data.name && data.profilePic;

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
          background: 'rgba(245, 0, 87, 0.08)',
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
          background: 'rgba(25, 118, 210, 0.05)',
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
                  background: 'linear-gradient(135deg, #f50057 0%, #1976d2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                Join Us Today
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: '1.1rem', lineHeight: 1.6, maxWidth: 520 }}
              >
                Create your account and become part of our thriving community. Unlock exclusive features and start your journey with us.
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'grid', gap: 2 }}>
              {[
                { icon: '✓', text: 'Quick and easy account creation' },
                { icon: '✓', text: 'Secure profile upload' },
                { icon: '✓', text: 'Instant access to all features' },
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
                      background: 'linear-gradient(135deg, #f50057 0%, #1976d2 100%)',
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

          {/* Right Section - Signup Form */}
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
                  background: 'linear-gradient(135deg, #f50057 0%, #1976d2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 8px 24px rgba(245, 0, 87, 0.3)',
                  animation: 'bounce 2s ease-in-out infinite',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                  },
                }}
              >
                <PersonIcon sx={{ fontSize: 36, color: 'white' }} />
              </Box>
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}
              >
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Fill in your details and upload a profile photo to get started
              </Typography>
            </Box>

            {/* Alerts */}
            {uploadError && (
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
                {uploadError}
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
              {/* Profile Picture Upload */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  p: 2.5,
                  borderRadius: 3,
                  border: '2px dashed #e0e0e0',
                  bgcolor: '#fafafa',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#1976d2',
                    bgcolor: '#f0f4ff',
                  },
                }}
              >
                <Avatar
                  src={data.profilePic ? `http://localhost:8000${data.profilePic}` : ''}
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.light',
                    boxShadow: data.profilePic ? '0 8px 20px rgba(25, 118, 210, 0.3)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {!data.profilePic && <PersonIcon sx={{ fontSize: 40 }} />}
                </Avatar>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  disabled={loading}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f50057 0%, #1976d2 100%)',
                      color: 'white',
                      borderColor: 'transparent',
                    },
                  }}
                >
                  {data.profilePic ? 'Change Photo' : 'Upload Photo'}
                  <input type="file" hidden onChange={handleUploadPic} />
                </Button>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Box sx={{ width: '100%', mt: 1 }}>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                  </Box>
                )}
                {uploadProgress === 100 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                    <CheckCircleIcon fontSize="small" />
                    <Typography variant="body2">Upload successful!</Typography>
                  </Box>
                )}
              </Box>

              {/* Name Field */}
              <Box>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={data.name}
                  onChange={handleOnChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon
                          sx={{
                            color: focusedField === 'name' ? '#f50057' : '#999',
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
                        boxShadow: '0 4px 12px rgba(245, 0, 87, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 8px 24px rgba(245, 0, 87, 0.2)',
                      },
                    },
                  }}
                />
              </Box>

              {/* Email Field */}
              <Box>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleOnChange}
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
                            color: focusedField === 'email' ? '#f50057' : '#999',
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
                        boxShadow: '0 4px 12px rgba(245, 0, 87, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 8px 24px rgba(245, 0, 87, 0.2)',
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
                  onChange={handleOnChange}
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
                            color: focusedField === 'password' ? '#f50057' : '#999',
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
                        boxShadow: '0 4px 12px rgba(245, 0, 87, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 8px 24px rgba(245, 0, 87, 0.2)',
                      },
                    },
                  }}
                />
              </Box>

              {/* Confirm Password Field */}
              <Box>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={data.confirmPassword}
                  onChange={handleOnChange}
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
                            color: focusedField === 'confirmPassword' ? '#f50057' : '#999',
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
                          sx={{
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            },
                          }}
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
                        boxShadow: '0 4px 12px rgba(245, 0, 87, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 8px 24px rgba(245, 0, 87, 0.2)',
                      },
                    },
                  }}
                />
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !isFormValid}
                sx={{
                  py: 1.75,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  background: isFormValid
                    ? 'linear-gradient(135deg, #f50057 0%, #1976d2 100%)'
                    : '#ccc',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  mt: 1.5,
                  '&:hover:not(:disabled)': {
                    background: 'linear-gradient(135deg, #d4003b 0%, #1565c0 100%)',
                    boxShadow: '0 12px 32px rgba(245, 0, 87, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active:not(:disabled)': {
                    transform: 'translateY(0)',
                  },
                  '&:disabled': {
                    opacity: 0.7,
                    cursor: 'not-allowed',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Create Account'
                )}
              </Button>

              {/* Link */}
              <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 1 }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#1976d2',
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
                  Login here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
export default SignUp;

 

