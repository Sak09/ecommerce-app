import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { fetchAllProducts } from "../redux/productsSlice";
import { fetchAllUsers } from "../redux/userSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products, loading: productsLoading } = useSelector((state) => state.products);
  const { allUsers, userDetail, loading: usersLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const categories = useMemo(() => {
    return [...new Set((products || []).map((product) => product.category).filter(Boolean))];
  }, [products]);

  const recentProducts = (products || []).slice(0, 4);
  const isLoading = productsLoading || usersLoading;

  if (isLoading && !products?.length && !allUsers?.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={360}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffff 0%, #eef6ff 58%, #fff4f8 100%)",
          border: "1px solid rgba(25, 118, 210, 0.12)",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" spacing={3}>
          <Box>
            <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5 }}>
              Welcome, {userDetail?.name || "Admin"}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 620, mt: 1 }}>
              Track your catalog, manage users, and jump into product operations from one responsive workspace.
            </Typography>
          </Box>
          <Button component={Link} to="/admin-panel/all-products" variant="contained" startIcon={<Inventory2Icon />}>
            Manage Products
          </Button>
        </Stack>
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5, mb: 3 }}>
        {[
          { label: "Total Products", value: products?.length || 0, icon: <Inventory2Icon />, color: "#1976d2" },
          { label: "Categories", value: categories.length, icon: <LocalOfferIcon />, color: "#f50057" },
          { label: "Users", value: allUsers?.length || 0, icon: <GroupIcon />, color: "#2e7d32" },
        ].map((card) => (
          <Paper key={card.label} elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(15, 23, 42, 0.08)" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
                  {card.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  {card.value}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: card.color }}>{card.icon}</Avatar>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" }, gap: 2.5 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(15, 23, 42, 0.08)" }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <TrendingUpIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Recent Products
            </Typography>
          </Stack>
          <Stack spacing={1.5}>
            {recentProducts.length ? recentProducts.map((product) => (
              <Stack key={product._id} direction="row" spacing={2} alignItems="center" sx={{ p: 1.25, borderRadius: 2, bgcolor: "background.default" }}>
                <Avatar src={product.productImage?.[0]} variant="rounded" sx={{ width: 52, height: 52 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800 }} noWrap>{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {product.brandName || "No brand"} - {product.category || "Uncategorized"}
                  </Typography>
                </Box>
              </Stack>
            )) : (
              <Typography color="text.secondary">No products uploaded yet.</Typography>
            )}
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(15, 23, 42, 0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Quick Actions
          </Typography>
          <Stack spacing={1.5}>
            <Button component={Link} to="/admin-panel/categories" variant="outlined">Browse Categories</Button>
            <Button component={Link} to="/admin-panel/all-users" variant="outlined">User Management</Button>
            <Button component={Link} to="/admin-panel/all-products" variant="contained">Product Management</Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
