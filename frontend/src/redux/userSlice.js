import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import summaryapi from '../common';

// Async thunk for user signup
export const signupUser = createAsyncThunk(
  'user/signup',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(summaryapi.signup.url, {
        method: summaryapi.signup.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
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

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(summaryapi.login.url, {
        method: summaryapi.login.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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

// Async thunk for updating user
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const token = document?.cookie
        .split('; ')
        .find(row => row.startsWith('access-token='))
        ?.split('=')[1];

      const response = await fetch(summaryapi.updateuser.url, {
        method: summaryapi.updateuser.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        body: JSON.stringify(userData),
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

// Async thunk for fetching all users
export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = document?.cookie
        .split('; ')
        .find(row => row.startsWith('access-token='))
        ?.split('=')[1];

      const response = await fetch(summaryapi.Allusers.url, {
        method: summaryapi.Allusers.method,
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

// Async thunk for uploading profile picture
export const uploadProfilePic = createAsyncThunk(
  'user/uploadProfilePic',
  async (file, { rejectWithValue }) => {
    try {
      const formdata = new FormData();
      formdata.append('file', file);

      const response = await fetch(summaryapi.upload.url, {
        method: summaryapi.upload.method,
        body: formdata,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for forgot password
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(summaryapi.forgotPassword.url, {
        method: summaryapi.forgotPassword.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
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

// Async thunk for reset password
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(summaryapi.resetPassword.url, {
        method: summaryapi.resetPassword.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
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
  userDetail: null,
  allUsers: [],
  loading: false,
  error: null,
  isAuthenticated: false,
  uploadedProfilePic: null,
  uploadError: null,
  resetSuccess: false,
  resetMessage: '',
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
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetail = action.payload?.data;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetail = action.payload?.data;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Fetch user details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetail = action.payload?.data || action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userDetail = null;
        state.isAuthenticated = false;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetail = action.payload?.data;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload?.data || action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.userDetail = null;
        state.allUsers = [];
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload profile picture
      .addCase(uploadProfilePic.pending, (state) => {
        state.loading = true;
        state.uploadError = null;
      })
      .addCase(uploadProfilePic.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedProfilePic = action.payload?.fileUrl;
        state.uploadError = null;
      })
      .addCase(uploadProfilePic.rejected, (state, action) => {
        state.loading = false;
        state.uploadError = action.payload;
        state.uploadedProfilePic = null;
      })
      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetMessage = '';
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.resetMessage = action.payload?.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.resetMessage = '';
      })
      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.resetSuccess = true;
        state.resetMessage = action.payload?.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.resetSuccess = false;
      });
  },
});

export const { clearUserError, setUserDetail } = userSlice.actions;
export default userSlice.reducer;
