import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'
import { fetchUserDetails } from '../redux/userSlice'

const Home = () => {
  const dispatch = useDispatch();
  const { userDetail, isAuthenticated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Redirect based on user role
  if (userDetail?.role === 'admin' || userDetail?.role === 'ADMIN') {
    return <Navigate to="/admin-panel" replace />
  }
  
  if (userDetail?.role === 'general' || userDetail?.role === 'GENERAL') {
    return <Navigate to="/shop" replace />
  }

  // If no role or not authenticated, redirect to login
  return <Navigate to="/login" replace />
}

export default Home
