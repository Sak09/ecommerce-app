import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import summaryapi from '../common';
import { apiRequest } from '../utils/apiClient';

const getCartItems = (payload) => payload?.data || [];
const getProductId = (item) => item?.productId?._id || item?.productId;

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest(summaryapi.getCart.url, {
        method: summaryapi.getCart.method,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productId, { rejectWithValue }) => {
    try {
      return await apiRequest(summaryapi.addToCart.url, {
        method: summaryapi.addToCart.method,
        body: JSON.stringify({ productId }),
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${summaryapi.removeFromCart.url}/${productId}`, {
        method: summaryapi.removeFromCart.method,
      });

      return { ...data, removedProductId: productId };
    } catch (error) {
      return rejectWithValue(error);
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
    clearCart: (state) => {
      state.cartItems = [];
      state.cartCount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = getCartItems(action.payload);
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
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          const addedProductId = getProductId(action.payload.data);
          const exists = state.cartItems.some(item => getProductId(item) === addedProductId);
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
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload.removedProductId;
        state.cartItems = state.cartItems.filter(item => getProductId(item) !== removedId);
        state.cartCount = state.cartItems.length;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      });
  },
});

export const { clearCart, clearCartError, updateCartCount } = cartSlice.actions;
export default cartSlice.reducer;
