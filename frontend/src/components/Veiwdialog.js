import { Dialog, DialogTitle, DialogContent, Typography, Button } from '@mui/material';

const ViewProductDialog = ({ open, onClose, product }) => {
  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Product Details</DialogTitle>
      <DialogContent>
        <img
          src={product.productImage?.[0]}
          alt={product.name}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <Typography><strong>Name:</strong> {product.name}</Typography>
        <Typography><strong>Brand:</strong> {product.brandName}</Typography>
        <Typography><strong>Category:</strong> {product.category}</Typography>
        <Typography><strong>Price:</strong> ₹{product.price}</Typography>
        <Typography><strong>Description:</strong> {product.description}</Typography>
        <Button onClick={onClose} style={{ marginTop: "10px" }}>Close</Button>
      </DialogContent>
    </Dialog>
  );
};
export default ViewProductDialog;
