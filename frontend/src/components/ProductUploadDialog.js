import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Productcategory from "../helpers/productCtegory";
import uploadimage from "../helpers/Imageupload";
import ImagePreviewDialog from "./ImagePreviewDialog";
import summaryapi from "../common";
import { toast } from "react-toastify";

const ProductUploadDialog = ({
  open,
  onClose,
  Productlist
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [product, setProduct] = useState({
    name: "",
    category: "",
    brandName: "",
    image: [],
    price: "",
    sellingprice: "",
    description: "",
  });

  const handleImageUpload = async (event) => {
    const files = event.target.files; 
    if (!files.length) return;

    try {
      const uploadedImages = await Promise.all(
        [...files].map(async (file) => {
          const uploadResponse = await uploadimage(file);
          return uploadResponse?.url; 
        })
      );
      const validImages = uploadedImages.filter((url) => url);

      if (validImages.length > 0) {
        setProduct((prev) => ({
          ...prev,
          image: [...prev.image, ...validImages],
        }));
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };
  const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("access-token="))
  ?.split("=")[1];
  
  const validateForm = () => {
    let newErrors = {};
    if (!product.name.trim()) newErrors.name = "Product name is required.";
    if (!product.category.trim()) newErrors.category = "Category is required.";
    if (!product.brandName.trim()) newErrors.brandName = "Brand name is required.";
    if (!product.price.trim()) newErrors.price = "Price is required.";
    if (!product.sellingprice.trim())
      newErrors.sellingprice = "Selling price is required.";
    if (!product.description.trim())
      newErrors.description = "Description is required.";
    if (product.image.length === 0)
      newErrors.image = "At least one image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const {name, value} =e.target;
    setProduct((prev) =>({...prev, [name]: value}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }
  
    try {
      const response = await fetch(summaryapi.uploadProduct.url, {
        method: summaryapi.uploadProduct.method,
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(product),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("oo",result);
        toast.success("Product uploaded successfully!");
        setProduct({
          name: "",
          category: "",
          brandName: "",
          price: "",
          sellingprice: "",
          description: "",
          image: [],
        });
        await Productlist();
        onClose(); 
      } else {
        toast.error(result.message || "Failed to upload product.");
      }
    } catch (error) {
      console.error("Error while submitting:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        disableScrollLock
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3, overflow: 'hidden', backgroundColor: '#f8fbff' },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>
          Upload Product
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <TextField
            label="Product Name"
            name="name"
            fullWidth
            margin="dense"
            onChange={handleChange}
            value={product.name}
            error={!!errors.name}
            helperText={errors.name}
          />
          <FormControl fullWidth margin="dense" error={!!errors.category}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={product.category}
              onChange={handleChange }
            >
              {Productcategory.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.category}
              </p>
            )}
          </FormControl>
          <TextField
            label="Brand Name"
            name="brandName"
            fullWidth
            margin="dense"
            onChange={handleChange}
            value={product.brandName}
            error={!!errors.brandName}
            helperText={errors.brandName}
          />

          <div
            style={{
              textAlign: 'center',
              border: '1px solid rgba(25, 118, 210, 0.2)',
              borderRadius: '14px',
              padding: '18px',
              background: '#fff',
            }}
          >
            <IconButton
              color="primary"
              component="label"
              style={{
                backgroundColor: '#e8f0fe',
                borderRadius: '14px',
                padding: '18px',
              }}
            >
              <CloudUploadIcon fontSize="large" />
              <input type="file" hidden onChange={handleImageUpload} />
            </IconButton>
            {errors.image && (
              <p style={{ color: 'red', fontSize: '12px' }}>{errors.image}</p>
            )}

            {product.image.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  marginTop: '10px',
                  gap: '10px',
                }}
              >
                {product.image.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Uploaded ${index}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      border: "2px solid #ddd",
                      padding: "5px",
                    }}
                    onClick={() => {
                      setPreviewImage(imgUrl);
                      setPreviewOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <TextField
            label="Price"
            name="price"
            type="number"
            fullWidth
            margin="dense"
            onChange={handleChange}
            value={product.price}
            error={!!errors.price}
            helperText={errors.price}
          />

          <TextField
            label="Selling Price"
            name="sellingprice"
            type="number"
            fullWidth
            margin="dense"
            onChange={handleChange}
            value={product.sellingprice}
            error={!!errors.sellingprice}
            helperText={errors.sellingprice}
          />

          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            onChange={handleChange}
            value={product.description}
            error={!!errors.description}
            helperText={errors.description}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <ImagePreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        imageUrl={previewImage}
      />
    </>
  );
};

export default ProductUploadDialog;
