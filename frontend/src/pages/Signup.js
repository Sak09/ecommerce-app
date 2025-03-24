import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import summaryapi from '../common';
import { TextField, Button, IconButton, InputAdornment, Typography, Box, Avatar } from '@mui/material';

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
      alert("Please select a file to upload.");
      return;
    }

    const formdata = new FormData();
    formdata.append("file", file);

    try {
      const response = await fetch(summaryapi.upload.url, {
        method: summaryapi.upload.method,
        body: formdata, 
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert("Profile picture uploaded successfully.");
          setData((prev) => ({
            ...prev,
            profilePic: result.fileUrl, 
          }));
        } else {
          alert(result.message || "Failed to upload the profile picture.");
        }
      } else {
        alert("Error uploading the profile picture.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while uploading the profile picture.");
    }
  };

 

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!data.profilePic) {
    alert("Please upload a profile picture before submitting.");
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
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f9f9f9"
    >
      <Box
        width="100%"
        maxWidth={400}
        bgcolor="white"
        p={4}
        boxShadow={3}
        borderRadius={2}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar
             src={data.profilePic ? `http://localhost:8000${data.profilePic}` : ''}
            sx={{ width: 80, height: 80, mb: 2 }}
          />
          <Button variant="contained" component="label" sx={{ textTransform: 'none' }}>
            Upload Photo
            <input type="file" hidden onChange={handleUploadPic} />
          </Button>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={data.name}
            onChange={handleOnChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            value={data.email}
            onChange={handleOnChange}
            type="email"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            value={data.password}
            onChange={handleOnChange}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            required
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
            margin="normal"
            required
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
            sx={{ mt: 3, py: 1.5 }}
          >
            Sign Up
          </Button>
        </form>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2 }}
        >
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1976d2' }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUp;
