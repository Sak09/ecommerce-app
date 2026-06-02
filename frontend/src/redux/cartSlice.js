import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import summaryapi from '../common';

// Async thunk for fetching cart
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = document?.cookie
        .split('; ')
        .find(row => row.startsWith('access-token='))
        ?.split('=')[1];

      const response = await fetch(summaryapi.getCart.url, {
        method: summaryapi.getCart.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
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

// Async thunk for adding to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productId, { rejectWithValue }) => {
    try {
      const token = document?.cookie
        .split('; ')
        .find(row => row.startsWith('access-token='))
        ?.split('=')[1];

      const response = await fetch(summaryapi.addToCart.url, {
        method: summaryapi.addToCart.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        body: JSON.stringify({ productId }),
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

// Async thunk for removing from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const token = document?.cookie
        .split('; ')
        .find(row => row.startsWith('access-token='))
        ?.split('=')[1];

      const response = await fetch(summaryapi.removeFromCart.url, {
        method: summaryapi.removeFromCart.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return { ...data, removedProductId: productId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
  cartCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
    updateCartCount: (state) => {
      state.cartCount = state.cartItems.length;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.data || action.payload;
        state.cartCount = state.cartItems.length;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.cartItems.push(action.payload.data);
          state.cartCount = state.cartItems.length;
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload.removedProductId;
        state.cartItems = state.cartItems.filter(item => item.productId !== removedId);
        state.cartCount = state.cartItems.length;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartError, updateCartCount } = cartSlice.actions;
export default cartSlice.reducer;
