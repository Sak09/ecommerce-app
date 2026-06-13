import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import summaryapi from '../common';

const getToken = () => document?.cookie
  .split('; ')
  .find(row => row.startsWith('access-token='))
  ?.split('=')[1];

const handleAuthExpired = (response, data) => {
  if (response.status === 401) {
    document.cookie = 'access-token=; Max-Age=0; path=/';
    return {
      authExpired: true,
      message: data?.message || 'Session expired. Please login again.',
    };
  }

  return data?.message || `Error: ${response.statusText}`;
};

// Async thunk for fetching cart
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();

      const response = await fetch(summaryapi.getCart.url, {
        method: summaryapi.getCart.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(handleAuthExpired(response, data));
      }

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
      const token = getToken();

      const response = await fetch(summaryapi.addToCart.url, {
        method: summaryapi.addToCart.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(handleAuthExpired(response, data));
      }

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
      const token = getToken();

      const response = await fetch(`${summaryapi.removeFromCart.url}/${productId}`, {
        method: summaryapi.removeFromCart.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(handleAuthExpired(response, data));
      }

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
        state.error = action.payload?.message || action.payload;
        if (action.payload?.authExpired) {
          state.cartItems = [];
          state.cartCount = 0;
        }
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          const exists = state.cartItems.some(item => item.productId?._id === action.payload.data.productId?._id);
          if (!exists) {
            state.cartItems.push(action.payload.data);
          }
          state.cartCount = state.cartItems.length;
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload.removedProductId;
        state.cartItems = state.cartItems.filter(item => item.productId?._id !== removedId && item.productId !== removedId);
        state.cartCount = state.cartItems.length;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      });
  },
});

export const { clearCartError, updateCartCount } = cartSlice.actions;
export default cartSlice.reducer;
