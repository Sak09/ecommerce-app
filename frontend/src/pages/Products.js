import React, { useState } from "react";
import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import ProductUploadDialog from "../components/ProductUploadDialog";
const Products = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]); 
  const [product, setProduct] = useState({ name: "", category: "", brand: "", image: [], price: "", selling: "", description: "" });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setProducts([...products, product]);
    setProduct({ name: "", category: "", brand: "", image: [],  price: "", selling: "", description: "" }); // Reset form
    handleClose();
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        All Products
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Upload Product
      </Button>

      {/* Upload Dialog */}
      <ProductUploadDialog
        open={open}
        onClose={handleClose}
        product={product}
        onChange={handleChange}
        onSubmit={handleSubmit}
        setProduct={setProduct}
      />

      {/* Display Uploaded Products */}
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px", gap: "20px" }}>
        {products.length > 0 ? (
          products.map((item, index) => (
            <Card key={index} style={{ width: "200px" }}>
              <CardMedia
                component="img"
                height="140"
                image={item.image || ""} 
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