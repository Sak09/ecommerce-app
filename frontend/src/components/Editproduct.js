import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import Productcategory from "../helpers/productCtegory";
import { toast } from "react-toastify";
import summaryapi from "../common";

const EditProductDialog = ({
  open,
  onClose,
  productData,
  onUpdate,
}) => {
    const product =
    Array.isArray(productData?.data) && productData.data.length > 0
      ? productData.data[0]
      : productData || {};

  const [data, setData] = useState({
    _id: product._id || "",
    productName: product?.name || "",
    brandName: product?.brandName || "",
    category: product?.category || "",
    productImage: product?.productImage || [],
    description: product?.description || "",
    price: product?.price || "",
  });

  useEffect(() => {
    const updatedProduct =
      Array.isArray(productData?.data) && productData.data.length > 0
        ? productData.data[0]
        : productData || {};

    setData({
      _id: updatedProduct?._id || "",
      productName: updatedProduct?.name || "",
      brandName: updatedProduct?.brandName || "",
      category: updatedProduct?.category || "",
      productImage: updatedProduct?.productImage || [],
      description: updatedProduct?.description || "",
      price: updatedProduct?.price || "",
    });
  }, [productData]);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!data.productName) newErrors.name = "Name is required";
    if (!data.brandName) newErrors.brandName = "Brand is required";
    if (!data.category) newErrors.category = "Category is required";
    if (!data.price) newErrors.price = "Price is required";
    if (!data.description) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error("Please fill all required fields");
    return;
  }

  try {
    const response = await fetch(`${summaryapi.editproduct.url}/${data._id}`, {
      method: summaryapi.editproduct.method, 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success("Product updated successfully!");
      onUpdate(); 
      onClose();  
    } else {
      toast.error(result.message || "Failed to update product");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    toast.error("Something went wrong");
  }
};

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <TextField

          name="name"
          fullWidth
          margin="dense"
          value={data.productName}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />
        <FormControl fullWidth margin="dense" error={!!errors.category}>
          <InputLabel>Category</InputLabel>
          <Select name="category" value={data.category} onChange={handleChange}>
            {Productcategory.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          label="Brand Name"
          name="brandName"
          fullWidth
          margin="dense"
          value={data.brandName}
          onChange={handleChange}
          error={!!errors.brandName}
          helperText={errors.brandName}
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          fullWidth
          margin="dense"
          value={data.price}
          onChange={handleChange}
          error={!!errors.price}
          helperText={errors.price}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          multiline
          rows={3}
          margin="dense"
          value={data.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
