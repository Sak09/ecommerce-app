import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, CardMedia, Typography,CardActions,IconButton } from "@mui/material";
import ProductUploadDialog from "../components/ProductUploadDialog";
import summaryapi from "../common";
import EditIcon from '@mui/icons-material/Edit';
import { toast } from "react-toastify";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
const Products = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]); 

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
  const handleDelete = async (productId) => {
  

  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    const result = await response.json();

    if (response.ok) {
      toast.success("Product deleted successfully");
      // fetchProducts(); 
    } else {
      toast.error(result.message || "Failed to delete product");
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Something went wrong while deleting product");
  }
};
const handleEdit = async (updatedProduct) => {
 
  try {
    const response = await fetch(`/api/products/${updatedProduct._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(updatedProduct),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success("Product updated successfully");
      // fetchProducts();
    } else {
      toast.error(result.message || "Failed to update product");
    }
  } catch (error) {
    console.error("Error editing product:", error);
    toast.error("Something went wrong while editing product");
  }
};


  
  

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
               <CardActions>
        <IconButton color="primary" onClick={() => handleEdit(item)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => handleDelete(item._id)}>
          <DeleteForeverIcon />
        </IconButton>
      </CardActions>
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