import React, { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import StorefrontIcon from '@mui/icons-material/Storefront'
import { fetchUserDetails } from '../redux/userSlice'

const Home = () => {
  const dispatch = useDispatch();
  const { userDetail, loading } = useSelector((state) => state.user);

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

  const role = userDetail?.role?.toUpperCase();

  // Redirect based on user role
  if (role === 'ADMIN') {
    return <Navigate to="/admin-panel" replace />
  }

  if (role === 'GENERAL') {
    const profilePicUrl = userDetail?.profilePic
      ? `http://localhost:8000${userDetail.profilePic}`
      : '';

    return (
      <Box sx={{ py: { xs: 2, md: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            overflow: 'hidden',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #eef6ff 58%, #fff4f8 100%)',
            border: '1px solid rgba(25, 118, 210, 0.12)',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
              gap: { xs: 3, md: 5 },
              p: { xs: 3, sm: 4, md: 6 },
              alignItems: 'center',
            }}
          >
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Avatar src={profilePicUrl} sx={{ width: 58, height: 58, bgcolor: 'primary.main' }}>
                  <AccountCircleIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
                    Welcome back
                  </Typography>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 900 }}>
                    {userDetail?.name || 'Shopper'}
                  </Typography>
                </Box>
              </Stack>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
                  lineHeight: 1.08,
                  mb: 2,
                }}
              >
                Your shopping space is ready.
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, maxWidth: 620, mb: 4 }}>
                Explore products, keep your delivery profile updated, and move faster from discovery to checkout.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button component={Link} to="/shop" variant="contained" size="large" startIcon={<StorefrontIcon />}>
                  Start Shopping
                </Button>
                <Button component={Link} to="/profile" variant="outlined" size="large" startIcon={<AccountCircleIcon />}>
                  Update Profile
                </Button>
              </Stack>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr' },
              }}
            >
              {[
                {
                  icon: <ShoppingBagIcon />,
                  title: 'Fresh Picks',
                  text: 'Browse the latest products added to the store.',
                  to: '/shop',
                },
                {
                  icon: <LocalShippingIcon />,
                  title: 'Delivery Ready',
                  text: 'Save your address once and checkout with less typing.',
                  to: '/profile',
                },
              ].map((item) => (
                <Paper
                  key={item.title}
                  component={Link}
                  to={item.to}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    color: 'inherit',
                    textDecoration: 'none',
                    bgcolor: 'rgba(255,255,255,0.82)',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 18px 42px rgba(15, 23, 42, 0.12)',
                    },
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 1 }}>{item.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary">{item.text}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }

  // If no role or not authenticated, redirect to login
  return <Navigate to="/login" replace />
}

export default Home
