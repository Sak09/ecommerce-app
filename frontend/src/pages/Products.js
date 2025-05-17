import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, CardMedia, Typography,CardActions,IconButton } from "@mui/material";
import ProductUploadDialog from "../components/ProductUploadDialog";
import summaryapi from "../common";
import EditIcon from '@mui/icons-material/Edit';
import EditProductDialog from '../components/Editproduct';
import { toast } from "react-toastify";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewProductDialog from '../components/Veiwdialog'
const Products = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]); 
<<<<<<< HEAD
  const [viewOpen, setViewOpen] = useState(false);
const [viewProduct, setViewProduct] = useState(null);

=======
>>>>>>> 390cbafcd99646afa79141ea95c19ee35db9a4c7
  const [editOpen, setEditOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("access-token="))
  ?.split("=")[1];
  
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    const res = await fetch(`${summaryapi.deleteproduct.url}/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Product deleted successfully");
     setProducts((prev) => ({
  ...prev,
  data: prev.data.filter((product) => product._id !== id),
}));

    } else {
      toast.error(data.message || "Delete failed");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};
<<<<<<< HEAD
const handleView = (product) => {
  setViewProduct(product);
  setViewOpen(true);
};

=======
>>>>>>> 390cbafcd99646afa79141ea95c19ee35db9a4c7
  

  

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(summaryapi.allproducts.url);
  
       const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  console.log("vd",products)
  
 
  useEffect(() => {
    fetchAllProducts();
  }, []);
  const handleEditClick = (product) => {
  setSelectedProduct(product);
  setEditOpen(true);
};


const handleUpdate = () => {
  fetchAllProducts();
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
        <IconButton>
          <EditIcon onClick={() => handleEditClick(products)} />
        </IconButton>
        <IconButton>
         <DeleteForeverIcon
  style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}
  onClick={() => handleDelete(item._id)}
/>
<<<<<<< HEAD
        </IconButton>
        <IconButton onClick={() => handleView(item)}>
         <VisibilityIcon/>
        </IconButton>
      </CardActions>
      <ViewProductDialog
  open={viewOpen}
  onClose={() => setViewOpen(false)}
  product={viewProduct}
/>

=======
        </IconButton>
      </CardActions>
>>>>>>> 390cbafcd99646afa79141ea95c19ee35db9a4c7
      
{selectedProduct && (
  <EditProductDialog
    open={editOpen}
    onClose={() => setEditOpen(false)}
    productData={selectedProduct}
    onUpdate={handleUpdate}

  />
)}
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