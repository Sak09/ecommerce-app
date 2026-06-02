import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Button,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import Person2Icon from "@mui/icons-material/Person2";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { fetchUserDetails, logoutUser } from "../redux/userSlice";
import { fetchCart } from "../redux/cartSlice";
import Logo from "./Logo";

const ROLE = {
  ADMIN: "ADMIN",
  GENERAL: "GENERAL",
};

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetail, isAuthenticated } = useSelector((state) => state.user);
  const { cartCount } = useSelector((state) => state.cart);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    dispatch(fetchUserDetails());
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleAdminNavigate = () => {
    handleClose();
    navigate("/admin-panel");
  };

  const profilePicUrl = userDetail?.profilePic
    ? `http://localhost:8000${userDetail.profilePic}`
    : null;

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        borderRadius: 3,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backdropFilter: "blur(10px)",
      }}
    >
      <Grid2 container alignItems="center" spacing={2}>
        {/* Left Section: Logo & Brand */}
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Logo />
            <Typography variant="h6" sx={{ display: { xs: "none", md: "block" }, fontWeight: 700 }}>
              Ecommerce
            </Typography>
          </Box>
        </Grid2>

        {/* Middle Section: Search Bar */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products, brands, categories..."
            slotProps={{
              input: {
                sx: { borderRadius: "999px" },
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid2>

        {/* Right Section: Actions & Profile */}
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Box
            display="flex"
            justifyContent={{ xs: "space-between", md: "flex-end" }}
            alignItems="center"
            gap={2}
            flexWrap="wrap"
          >
            {/* Menu Anchor Container */}
            {isAuthenticated && userDetail && (
              <Box>
                <IconButton
                  onClick={handleMenuClick}
                  sx={{ borderRadius: 2, bgcolor: "background.default", p: 0.5 }}
                  aria-controls={isMenuOpen ? "profile-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen ? "true" : undefined}
                >
                  <Avatar src={profilePicUrl} alt="Profile" sx={{ width: 40, height: 40 }}>
                    <Person2Icon />
                  </Avatar>
                </IconButton>

                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleClose}
                  disableScrollLock
                >
                  {userDetail?.role === ROLE.ADMIN && (
                    <MenuItem onClick={handleAdminNavigate}>
                      Admin Panel
                    </MenuItem>
                  )}
                  {userDetail?.role === 'general' && (
                    <MenuItem component={Link} to="/shop" onClick={handleClose}>
                      Shop
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            )}

            {/* Cart Badge */}
            <IconButton
              component={Link}
              to="/cart"
              color="inherit"
              sx={{ p: 1 }}
            >
              <Badge
                badgeContent={cartCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    minWidth: 20,
                    height: 20,
                    borderRadius: "50%",
                  },
                }}
              >
                <ShoppingCartIcon fontSize="large" />
              </Badge>
            </IconButton>

            {/* Auth Buttons */}
            {isAuthenticated && userDetail ? (
              <Button variant="contained" color="error" onClick={handleLogout} sx={{ whiteSpace: "nowrap" }}>
                Logout
              </Button>
            ) : (
              <Button component={Link} to="/login" variant="contained" color="primary" sx={{ whiteSpace: "nowrap" }}>
                Login
              </Button>
            )}
          </Box>
        </Grid2>
      </Grid2>
    </Paper>
  );
};

export default Header;