import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context'
import { Box, CircularProgress } from '@mui/material'

const Home = () => {
  const { userDetail } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give context a moment to update
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [userDetail]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Redirect based on user role
  if (userDetail?.data?.role === 'admin' || userDetail?.data?.role === 'ADMIN') {
    return <Navigate to="/admin-panel" replace />
  }
  
  if (userDetail?.data?.role === 'general' || userDetail?.data?.role === 'GENERAL') {
    return <Navigate to="/shop" replace />
  }

  // If no role or not authenticated, redirect to login
  return <Navigate to="/login" replace />
}

export default Home
