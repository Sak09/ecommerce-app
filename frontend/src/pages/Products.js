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
  CircularProgress,
} from "@mui/material";
import ProductUploadDialog from "../components/ProductUploadDialog";
import EditIcon from '@mui/icons-material/Edit';
import EditProductDialog from '../components/Editproduct';
import { toast } from "react-toastify";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewProductDialog from '../components/Veiwdialog';
import { fetchAllProducts, deleteProduct } from '../redux/productsSlice';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const result = await dispatch(deleteProduct(id)).unwrap();
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(err || "Something went wrong");
    }
  };

  const handleView = (product) => {
    setViewProduct(product);
    setViewOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const handleUpdate = () => {
    dispatch(fetchAllProducts());
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        All Products
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 3 }}>
        Upload Product
      </Button>

      <ProductUploadDialog open={open} onClose={handleClose} onSuccess={handleUpdate} />

      <Grid container spacing={3}>
        {products && products.length > 0 ? (
          products.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id || index}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.productImage?.[0] || ""}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {item.category} - {item.brand}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }} noWrap>
                    {item.description || 'No description available.'}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <IconButton size="small" onClick={() => handleEditClick(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(item._id)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </Box>
                  <IconButton size="small" onClick={() => handleView(item)}>
                    <VisibilityIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
            <Typography variant="body1">No products uploaded yet.</Typography>
          </Box>
        )}
      </Grid>

      <ViewProductDialog open={viewOpen} onClose={() => setViewOpen(false)} product={viewProduct} />

      {selectedProduct && (
        <EditProductDialog open={editOpen} onClose={() => setEditOpen(false)} productData={selectedProduct} onUpdate={handleUpdate} />
      )}
    </Container>
  );
};

export default Products;