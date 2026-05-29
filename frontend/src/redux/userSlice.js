import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import summaryapi from '../common';

// Async thunk for fetching user details
export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = document?.cookie
        .split('; ')
        .find(row => row.startsWith('access-token='))
        ?.split('=')[1];

      if (!token) {
        return null;
      }

      const response = await fetch(summaryapi.current_user.url, {
        method: summaryapi.current_user.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
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

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(summaryapi.logout.url, {
        method: summaryapi.logout.method,
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        return null;
      }
      throw new Error('Logout failed');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  userDetail: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    setUserDetail: (state, action) => {
      state.userDetail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetail = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userDetail = null;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.userDetail = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError, setUserDetail } = userSlice.actions;
export default userSlice.reducer;
