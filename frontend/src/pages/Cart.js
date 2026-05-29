import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import summaryapi from "../common";
import AuthContext from "../context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userDetail } = useContext(AuthContext);
  const navigate = useNavigate();

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access-token="))
    ?.split("=")[1];

  const fetchCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(summaryapi.getCart.url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setCartItems(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      const res = await fetch(
        `${summaryapi.removeFromCart.url}/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Product removed from cart");
        setCartItems((prev) =>
          prev.filter((item) => item.productId._id !== productId)
        );
      } else {
        toast.error(data.message || "Failed to remove product");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Something went wrong");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.productId?.price || 0);
    }, 0);
  };

  const handleCheckout = () => {
    toast.info("Proceeding to checkout...");
    // You can implement actual checkout logic here
  };

  const handleContinueShopping = () => {
    navigate("/shop");
  };

  if (loading) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            bgcolor: "background.default",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add items from our shop to get started
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: "primary.light" }}>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow
                      key={item._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CardMedia
                            component="img"
                            image={
                              item.productId?.productImage?.[0] ||
                              "placeholder.jpg"
                            }
                            alt={item.productId?.name}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 1,
                              mr: 2,
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {item.productId?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.productId?.category} • {item.productId?.brand}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 600 }}>
                          ₹{item.productId?.price || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleRemoveFromCart(item.productId._id)
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  Order Summary
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">₹{calculateTotal()}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Shipping:</Typography>
                  <Typography variant="body2">FREE</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body2">Tax (10%):</Typography>
                  <Typography variant="body2">
                    ₹{(calculateTotal() * 0.1).toFixed(2)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                    ₹{(calculateTotal() * 1.1).toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  size="large"
                  onClick={handleCheckout}
                  sx={{ mb: 2, py: 1.5 }}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;
