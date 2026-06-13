import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ProductCategory from "../helpers/productCtegory";
import { fetchUserDetails } from "../redux/userSlice";

const navItems = [
  { label: "Dashboard", to: "/admin-panel", icon: <DashboardIcon fontSize="small" />, end: true },
  { label: "Category Products", to: "/admin-panel/categories", icon: <CategoryIcon fontSize="small" /> },
  { label: "Product Management", to: "/admin-panel/all-products", icon: <Inventory2Icon fontSize="small" /> },
  { label: "User Management", to: "/admin-panel/all-users", icon: <GroupIcon fontSize="small" /> },
];

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetail, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  const profilePicUrl = userDetail?.profilePic ? `http://localhost:8000${userDetail.profilePic}` : "";

  return (
    <Box sx={{ py: { xs: 1, md: 3 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px minmax(0, 1fr)" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid rgba(15, 23, 42, 0.08)",
            position: { md: "sticky" },
            top: { md: 112 },
          }}
        >
          {loading && !userDetail ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={2.5}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar src={profilePicUrl} sx={{ width: 54, height: 54, bgcolor: "primary.main" }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 900 }} noWrap>
                    {userDetail?.name || "Admin"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {userDetail?.email || "Admin portal"}
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              <Stack spacing={0.75}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    component={NavLink}
                    to={item.to}
                    end={item.end}
                    startIcon={item.icon}
                    fullWidth
                    sx={{
                      justifyContent: "flex-start",
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 800,
                      color: "text.primary",
                      "&.active": {
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                      },
                      "&.active:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>

              <Divider />

              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 900 }}>
                  Categories
                </Typography>
                <Stack spacing={0.75} sx={{ mt: 1, maxHeight: { md: 260 }, overflowY: { md: "auto" } }}>
                  {ProductCategory.map((category) => (
                    <Button
                      key={category}
                      onClick={() => navigate(`/admin-panel/categories?category=${encodeURIComponent(category)}`)}
                      startIcon={<StorefrontIcon fontSize="small" />}
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        color: "text.primary",
                        borderRadius: 2,
                        fontWeight: 700,
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </Stack>
              </Box>

              <Button component={Link} to="/shop" variant="outlined" startIcon={<StorefrontIcon />}>
                View Store
              </Button>
            </Stack>
          )}
        </Paper>

        <Box sx={{ minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPanel;
