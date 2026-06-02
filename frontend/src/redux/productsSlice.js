import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import summaryapi from '../common';

// Async thunk for fetching all products
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(summaryapi.allproducts.url, {
        method: summaryapi.allproducts.method,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for uploading product
export const uploadProduct = createAsyncThunk(
  'products/uploadProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const token = document?.cookie
        .split('; ')
        .find(row => row.startsWith('access-token='))
        ?.split('=')[1];

      const response = await fetch(summaryapi.uploadProduct.url, {
        method: summaryapi.uploadProduct.method,
        credentials: 'include',
        headers: {
          Authorization: token || '',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for editing product
export const editProduct = createAsyncThunk(
  'products/editProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = document?.cookie
        .split('; ')
        .find(row => row.startsWith('access-token='))
        ?.split('=')[1];

      const response = await fetch(`${summaryapi.editproduct.url}/${id}`, {
        method: summaryapi.editproduct.method,
        credentials: 'include',
        headers: {
          Authorization: token || '',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const token = document?.cookie
        .split('; ')
        .find(row => row.startsWith('access-token='))
        ?.split('=')[1];

      const response = await fetch(`${summaryapi.deleteproduct.url}/${id}`, {
        method: summaryapi.deleteproduct.method,
        credentials: 'include',
        headers: {
          Authorization: token || '',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return { ...data, deletedId: id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching products by category
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await fetch(`${summaryapi.categoryproduct.url}?category=${category}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  loading: false,
  error: null,
  totalProducts: 0,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || action.payload;
        state.filteredProducts = action.payload.data || action.payload;
        state.totalProducts = action.payload.totalProductCount || 0;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload product
      .addCase(uploadProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.products.unshift(action.payload.data);
          state.filteredProducts.unshift(action.payload.data);
        }
      })
      .addCase(uploadProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit product
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload?.data;
        if (updatedProduct) {
          const index = state.products.findIndex(p => p._id === updatedProduct._id);
          if (index !== -1) {
            state.products[index] = updatedProduct;
            state.filteredProducts[index] = updatedProduct;
          }
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.deletedId;
        state.products = state.products.filter(p => p._id !== deletedId);
        state.filteredProducts = state.filteredProducts.filter(p => p._id !== deletedId);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload.data || action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductError, setSelectedProduct, setFilteredProducts } = productsSlice.actions;
export default productsSlice.reducer;
