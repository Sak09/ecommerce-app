import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import Person2Icon from "@mui/icons-material/Person2";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Grid2 from "@mui/material/Grid2";
import AuthContext from "../context/index";
import Logo from "./Logo"; 

const ROLE = {
  ADMIN: "ADMIN",
  GENERAL: "GENERAL"
  }
const Header = () => {
  const { fetchUserDetails, userDetail, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails(); 
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(); 
    navigate("login");
  };


 

  return (
    <Paper elevation={3} sx={{ padding: "10px 20px", marginBottom: "20px", borderRadius: "12px" }}>
      <Grid2 container alignItems="center" spacing={2}>
    
        <Grid2 item xs={3}>
          <Logo />
        </Grid2>

    
        <Grid2 item xs={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            InputProps={{
              style: { borderRadius: "50px" },
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid2>

    
        <Grid2 item xs={3} style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
  
          <IconButton onClick={handleMenuClick}>
            {userDetail?.data?.profilePic ? (
              <img
                src={`http://localhost:8000${userDetail.data.profilePic}`}
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Person2Icon />
            )}
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {/* {userDetail?.data?.role === ROLE.ADMIN && ( */}
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/admin-panel");
                }}
              >
                Admin Panel
              </MenuItem>
            {/* )} */}
          </Menu>

        
          <Badge
            color="error"
            variant="dot"
            sx={{
              "& .MuiBadge-dot": {
                minWidth: "10px",
                height: "10px",
                borderRadius: "50%",
                top: "5px",
                right: "5px",
              },
            }}
          >
            <ShoppingCartIcon style={{ marginTop: "5px" }} />
          </Badge>

    
          <div>
            {userDetail?.data ? (
              <Button onClick={handleLogout} variant="contained" color="error">
                Logout
              </Button>
            ) : (
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Box
                  sx={{
                    padding: "5px 15px",
                    borderRadius: "20px",
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Login
                </Box>
              </Link>
            )}
          </div>
        </Grid2>
      </Grid2>
    </Paper>
  );
};

export default Header;
