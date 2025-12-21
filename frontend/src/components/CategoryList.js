import React, { useEffect, useState } from "react";
import {
  Container,
  Grid2,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import summaryapi from "../common";

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProductByCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(summaryapi.categoryproduct.url);
      const dataResponse = await response.json();
      setCategoryProduct(dataResponse.data || []);
    } catch (error) {
      console.error("Error fetching category products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductByCategory();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        categoryProduct.map((item, index) => (
          <Box key={index} sx={{ mb: 5 }}>
            <Typography
              variant="h5"
              color="primary"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {item.category}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Card elevation={3}>
              <Grid2 container spacing={0}>
                <Grid2 item xs={12} sm={4}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.productImage?.[0] || "/placeholder.jpg"}
                    alt={item.name}
                    sx={{ objectFit: "cover" }}
                  />
                </Grid2>
                <Grid2 item xs={12} sm={8}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item.description}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>
                      Price: ₹{item.price}
                    </Typography>
                    <ShoppingCartIcon/>
                    
                  </CardContent>
                </Grid2>
              </Grid2>
            </Card>
          </Box>
        ))
      )}
    </Container>
  );
};

export default CategoryList;
