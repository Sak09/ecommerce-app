import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import summaryapi from '../common';
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  Avatar,
  Paper,
} from '@mui/material';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    profilePic: '',
  });
  const navigate = useNavigate();

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
      alert('Please select a file to upload.');
      return;
    }

    const formdata = new FormData();
    formdata.append('file', file);

    try {
      const response = await fetch(summaryapi.upload.url, {
        method: summaryapi.upload.method,
        body: formdata,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('Profile picture uploaded successfully.');
          setData((prev) => ({
            ...prev,
            profilePic: result.fileUrl,
          }));
        } else {
          alert(result.message || 'Failed to upload the profile picture.');
        }
      } else {
        alert('Error uploading the profile picture.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while uploading the profile picture.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.profilePic) {
      alert('Please upload a profile picture before submitting.');
      return;
    }

    if (data.password === data.confirmPassword) {
      try {
        const response = await fetch(summaryapi.signup.url, {
          method: summaryapi.signup.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result.success) {
          alert(result.message);
          navigate('/login');
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('An error occurred during sign-up. Please try again.');
      }
    } else {
      alert('Passwords do not match. Please check and try again.');
    }
  };

  return (
    <Box
      minHeight="calc(100vh - 210px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={6}
      sx={{
        bgcolor: 'linear-gradient(180deg, #eef4ff 0%, #f9fbff 100%)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          px: { xs: 2, sm: 3 },
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 2,
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.75)',
              boxShadow: '0 24px 64px rgba(15, 23, 42, 0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
              Join the community.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520 }}>
              Create your account in seconds and start managing products, orders, and customers from a modern dashboard.
            </Typography>
            <Box sx={{ display: 'grid', gap: 1, mt: 2 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                • Smooth onboarding experience
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                • Responsive and polished interface
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                • Secure signup with profile upload support
              </Typography>
            </Box>
          </Box>

          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              boxShadow: '0 24px 64px rgba(15, 23, 42, 0.08)',
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar
                src={data.profilePic ? `http://localhost:8000${data.profilePic}` : ''}
                sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.light' }}
              />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                Create your account
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Upload a profile image and fill in your details to get started.
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                sx={{ textTransform: 'none', py: 1.25, borderRadius: 3 }}
              >
                {data.profilePic ? 'Change Profile Photo' : 'Upload Profile Photo'}
                <input type="file" hidden onChange={handleUploadPic} />
              </Button>

              <TextField
                label="Name"
                name="name"
                value={data.name}
                onChange={handleOnChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Email"
                name="email"
                value={data.email}
                onChange={handleOnChange}
                type="email"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Password"
                name="password"
                value={data.password}
                onChange={handleOnChange}
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleOnChange}
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
              >
                Create Account
              </Button>
            </Box>

            <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#1976d2', fontWeight: 600 }}>
                Login
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
