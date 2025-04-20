import React, { useContext, useState } from 'react';
import { Paper, Button, Grid2, TextField, IconButton, Typography, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import summaryapi from "../common/index";
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
  const { fetchUserDetails} = useContext(context);
  const handleLoginClick = () => {
    setIsButtonEnlarged(true);
    setTimeout(() => setIsButtonEnlarged(false), 500);
    console.log('Logging in with:', data);
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), 
      });
  
      const dataApi = await dataResponse.json();
      Cookies.set('access-token', dataApi.data.token);
  
      if (dataApi.success) {
        console.log("Login successful");
  
        setShowsuccessalert(true);
  
    
        if (fetchUserDetails) await fetchUserDetails();
  
    
        setTimeout(() => {
          navigate('/'); 
          setShowsuccessalert(false);
        }, 2000);
      } else {
        console.error("Login failed:", dataApi.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
     {showSuccessalert && (
  <Alert
    icon={<CheckIcon fontSize="inherit" />}
    severity="success"
    style={{ margin: "10px 0", transition: "opacity 0.5s ease-in-out" }}
  >
    Login successful! 
  </Alert>
)}
    <Paper
      elevation={3}
      style={{
        padding: '30px',
        maxWidth: '400px',
        margin: '50px auto',
        textAlign: 'center',
      }}
    >
     

      <form onSubmit={handleSubmit}> {/* Ensure the form is using onSubmit to trigger handleSubmit */}
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
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
          <Grid2 item xs={12} style={{ position: 'relative' }}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={data.password}
              onChange={handleInputChange}
              required
            />
            <IconButton
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </Grid2>
          <Grid2 item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLoginClick}
              style={{
                marginTop: '20px',
                transition: 'all 0.3s ease',
                transform: isButtonEnlarged ? 'scale(1.2)' : 'scale(1)',
              }}
              type="submit" // Use type="submit" to trigger form submission
            >
              Login
            </Button>
          </Grid2>
          <Grid2 item xs={12}>
            <Link
              to="/forgot-password"
              style={{
                display: 'block',
                marginTop: '10px',
                textDecoration: 'none',
                color: 'blue',
              }}
            >
              Forgot password?
            </Link>
            <span style={{ display: 'block', marginTop: '10px' }}>
              Do not have an account?
              <Link
                to="/sign-up"
                style={{
                  textDecoration: 'none',
                  color: 'blue',
                  marginLeft: '5px',
                }}
              >
                Sign up
              </Link>
            </span>
          </Grid2>
        </Grid2>
      </form>
    </Paper>
    </>
  );
};

export default Login;
