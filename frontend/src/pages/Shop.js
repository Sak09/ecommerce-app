import React, { useState, useEffect, useContext } from "react";
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
} from "@mui/material";
import summaryapi from "../common";
import AuthContext from "../context";
import { toast } from "react-toastify";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userDetail } = useContext(AuthContext);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access-token="))
    ?.split("=")[1];

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(summaryapi.allproducts.url);
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(summaryapi.addToCart.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (res.ok) {
        setSnackbar({
          open: true,
          message: "Product added to cart!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Failed to add to cart",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    }
  };

  const handleBuyNow = async (product) => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      // Add to cart first
      const res = await fetch(summaryapi.addToCart.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        credentials: "include",
        body: JSON.stringify({ productId: product._id }),
      });

      if (res.ok) {
        // Redirect to checkout/cart
        navigate("/cart");
      } else {
        toast.error("Failed to process order");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    }
  };

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

      {loading ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography>Loading products...</Typography>
        </Box>
      ) : products.length > 0 ? (
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
