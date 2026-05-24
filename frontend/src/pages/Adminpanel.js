import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import context from "../context";
import { Box, Grid2, Paper, Avatar, Typography, Button, Stack } from "@mui/material";

const AdminPanel = () => {
  const { fetchUserDetails } = useContext(context);
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const user = await fetchUserDetails();
      if (user && user.data) {
        setUserData(user.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Grid2 container spacing={3}>
        <Grid2 item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            {userData ? (
              <Box>
                <Box display="flex" justifyContent="center" mb={3}>
                  <Avatar
                    src={`http://localhost:8000${userData.profilePic}`}
                    alt="Profile"
                    sx={{ width: 140, height: 140 }}
                  />
                </Box>
                <Typography variant="h5" align="center" gutterBottom>
                  {userData.name || "Admin"}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" mb={2}>
                  {userData.email || "No email available"}
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
              <Typography align="center">Loading user data...</Typography>
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
