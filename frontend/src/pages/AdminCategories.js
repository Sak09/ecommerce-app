import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ProductCategory from "../helpers/productCtegory";
import { fetchAllProducts } from "../redux/productsSlice";

const AdminCategories = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading } = useSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    const category = searchParams.get("category") || "All";
    setSelectedCategory(category);
  }, [searchParams]);

  const categories = useMemo(() => {
    const existing = (products || []).map((product) => product.category).filter(Boolean);
    return ["All", ...new Set([...ProductCategory, ...existing])];
  }, [products]);

  const productsByCategory = useMemo(() => {
    return (products || []).filter((product) => {
      return selectedCategory === "All" || product.category === selectedCategory;
    });
  }, [products, selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  if (loading && !products?.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={360}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" spacing={2} mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Category Products
          </Typography>
          <Typography color="text.secondary">
            Review catalog items by department and spot empty categories quickly.
          </Typography>
        </Box>
        <Chip label={`${productsByCategory.length} products`} color="primary" />
      </Stack>

      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, mb: 3, border: "1px solid rgba(15, 23, 42, 0.08)" }}>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              color={selectedCategory === category ? "primary" : "default"}
              variant={selectedCategory === category ? "filled" : "outlined"}
              onClick={() => handleCategoryClick(category)}
              sx={{ fontWeight: 700 }}
            />
          ))}
        </Stack>
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 2.5 }}>
        {productsByCategory.length ? productsByCategory.map((product) => (
          <Paper key={product._id} elevation={0} sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid rgba(15, 23, 42, 0.08)" }}>
            <Box
              component="img"
              src={product.productImage?.[0] || ""}
              alt={product.name}
              sx={{ width: "100%", height: 180, objectFit: "cover", bgcolor: "background.default" }}
            />
            <Box sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Inventory2Icon color="primary" fontSize="small" />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                  {product.category || "Uncategorized"}
                </Typography>
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 800 }} noWrap>
                {product.name}
              </Typography>
              <Typography color="text.secondary" noWrap>
                {product.brandName || "No brand"}
              </Typography>
              <Typography sx={{ mt: 1.5, fontWeight: 900, color: "primary.main" }}>
                Rs. {product.price || 0}
              </Typography>
            </Box>
          </Paper>
        )) : (
          <Paper elevation={0} sx={{ gridColumn: "1 / -1", p: 5, borderRadius: 3, textAlign: "center", border: "1px solid rgba(15, 23, 42, 0.08)" }}>
            <Avatar sx={{ mx: "auto", mb: 2, bgcolor: "primary.light" }}>
              <Inventory2Icon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              No products in this category yet
            </Typography>
            <Typography color="text.secondary">
              Add products from Product Management and they will appear here.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default AdminCategories;
