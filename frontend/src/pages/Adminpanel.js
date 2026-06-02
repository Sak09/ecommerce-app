import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid2, Paper, Avatar, Typography, Button, Stack, CircularProgress } from "@mui/material";
import { fetchUserDetails } from "../redux/userSlice";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { userDetail, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Grid2 container spacing={3}>
        <Grid2 item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
              </Box>
            ) : userDetail ? (
              <Box>
                <Box display="flex" justifyContent="center" mb={3}>
                  <Avatar
                    src={`http://localhost:8000${userDetail.profilePic}`}
                    alt="Profile"
                    sx={{ width: 140, height: 140 }}
                  />
                </Box>
                <Typography variant="h5" align="center" gutterBottom>
                  {userDetail.name || "Admin"}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" mb={2}>
                  {userDetail.email || "No email available"}
                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Button
                    component={Link}
                    to="all-users"
                    variant="outlined"
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    View All Users
                  </Button>
                  <Button
                    component={Link}
                    to="all-products"
                    variant="contained"
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    View All Products
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Typography align="center">No user data available</Typography>
            )}
          </Paper>
        </Grid2>

        <Grid2 item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 2, minHeight: 360, borderRadius: 3, bgcolor: 'background.default' }}>
            <Outlet />
          </Paper>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default AdminPanel;
