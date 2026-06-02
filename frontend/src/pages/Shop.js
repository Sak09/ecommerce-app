import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  IconButton,
  Box,
  Grid,
  Container,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { fetchAllProducts } from "../redux/productsSlice";
import { addToCart } from "../redux/cartSlice";

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const result = await dispatch(addToCart(productId)).unwrap();
      setSnackbar({
        open: true,
        message: "Product added to cart!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      setSnackbar({
        open: true,
        message: error || "Failed to add to cart",
        severity: "error",
      });
    }
  };

  const handleBuyNow = async (product) => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      // Add to cart first
      await dispatch(addToCart(product._id)).unwrap();
      // Redirect to checkout/cart
      navigate("/cart");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Our Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and shop from our exclusive collection
        </Typography>
      </Box>

      {products && products.length > 0 ? (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-4px)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={product.productImage?.[0] || ""}
                  alt={product.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.brand} • {product.category}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      my: 1,
                    }}
                  >
                    {product.description || "No description available"}
                  </Typography>
                  {product.price && (
                    <Typography
                      variant="h6"
                      sx={{
                        color: "primary.main",
                        fontWeight: 700,
                        mt: 2,
                      }}
                    >
                      ₹{product.price}
                    </Typography>
                  )}
                </CardContent>

                <CardActions
                  sx={{
                    gap: 1,
                    justifyContent: "space-between",
                    px: 1,
                    py: 1,
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(product._id)}
                    fullWidth
                  >
                    Add to Cart
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => handleBuyNow(product)}
                    fullWidth
                  >
                    Buy Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products available at the moment
          </Typography>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Shop;
               