import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import ProductUploadDialog from "../components/ProductUploadDialog";
import summaryapi from "../common";
const Products = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]); 

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log("products",products)
  const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("access-token="))
  ?.split("=")[1];

  

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(summaryapi.allproducts.url);
  
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
 
  useEffect(() => {
    fetchAllProducts();
  }, []);
  
  

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        All Products
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Upload Product
      </Button>

      <ProductUploadDialog
        open={open}
        onClose={handleClose}
        
      />

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px", gap: "20px" }}>
        {products?.data?.length > 0 ? (
          products.data.map((item, index) => (
            <Card key={index} style={{ width: "200px" }}>
              <CardMedia
                component="img"
                height="140"
                 image={item.productImage?.[0] || ""}
                alt={item.name}
              />
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.category} - {item.brand}
                </Typography>
                
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" style={{ marginTop: "20px" }}>
            No products uploaded yet.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Products;