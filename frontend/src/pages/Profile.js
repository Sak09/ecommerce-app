import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import SaveIcon from "@mui/icons-material/Save";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { fetchUserDetails, updateUser } from "../redux/userSlice";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
};

const Profile = () => {
  const dispatch = useDispatch();
  const { userDetail, isAuthenticated, loading, error } = useSelector((state) => state.user);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    if (userDetail) {
      setForm({
        name: userDetail.name || "",
        email: userDetail.email || "",
        phone: userDetail.phone || "",
        street: userDetail.address?.street || "",
        city: userDetail.address?.city || "",
        state: userDetail.address?.state || "",
        pincode: userDetail.address?.pincode || "",
        country: userDetail.address?.country || "",
      });
    }
  }, [userDetail]);

  const profilePicUrl = useMemo(() => {
    return userDetail?.profilePic ? `http://localhost:8000${userDetail.profilePic}` : "";
  }, [userDetail?.profilePic]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(updateUser({
        _id: userDetail._id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: form.country,
        },
      })).unwrap();
      setSaved(true);
    } catch (err) {
      setSaved(false);
    }
  };

  if (!loading && !isAuthenticated && !userDetail) {
    return <Navigate to="/login" replace />;
  }

  if (loading && !userDetail) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 2, md: 5 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "0.85fr 1.4fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
          <Stack alignItems="center" spacing={2.5}>
            <Avatar src={profilePicUrl} sx={{ width: 126, height: 126, bgcolor: "primary.main" }}>
              <AccountCircleIcon sx={{ fontSize: 72 }} />
            </Avatar>
            <Box textAlign="center">
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {userDetail?.name || "Your Profile"}
              </Typography>
              <Typography color="text.secondary">{userDetail?.email}</Typography>
            </Box>
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 999,
                bgcolor: "primary.light",
                color: "primary.contrastText",
                fontWeight: 700,
                textTransform: "capitalize",
              }}
            >
              {userDetail?.role || "general"}
            </Box>
            <Divider flexItem />
            <Button component={Link} to="/shop" variant="outlined" fullWidth startIcon={<StorefrontIcon />}>
              Continue Shopping
            </Button>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              Profile Details
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Keep your contact details and delivery address ready for faster checkout.
            </Typography>

            {saved && <Alert severity="success" sx={{ mb: 2 }}>Profile updated successfully.</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField name="name" label="Full Name" value={form.name} onChange={handleChange} InputProps={{ startAdornment: <BadgeIcon sx={{ mr: 1, color: "text.secondary" }} /> }} />
              <TextField name="email" label="Email" type="email" value={form.email} onChange={handleChange} InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: "text.secondary" }} /> }} />
              <TextField name="phone" label="Phone Number" value={form.phone} onChange={handleChange} InputProps={{ startAdornment: <LocalPhoneIcon sx={{ mr: 1, color: "text.secondary" }} /> }} />
              <TextField name="country" label="Country" value={form.country} onChange={handleChange} />
              <TextField name="street" label="Address" value={form.street} onChange={handleChange} multiline minRows={2} sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }} InputProps={{ startAdornment: <HomeIcon sx={{ mr: 1, color: "text.secondary", alignSelf: "flex-start", mt: 1 }} /> }} />
              <TextField name="city" label="City" value={form.city} onChange={handleChange} />
              <TextField name="state" label="State" value={form.state} onChange={handleChange} />
              <TextField name="pincode" label="Pincode" value={form.pincode} onChange={handleChange} />
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />} disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Profile;
