# Redux Quick Reference Guide

## 📋 Quick Links

- **Store**: `frontend/src/redux/store.js`
- **User Slice**: `frontend/src/redux/userSlice.js`
- **Products Slice**: `frontend/src/redux/productsSlice.js`
- **Cart Slice**: `frontend/src/redux/cartSlice.js`
- **Full Documentation**: `frontend/src/redux/README.md`

## 🎯 Import Statements

```javascript
// Always start with these imports
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails, loginUser, logoutUser } from '../redux/userSlice';
import { fetchAllProducts, deleteProduct, uploadProduct } from '../redux/productsSlice';
import { fetchCart, addToCart, removeFromCart } from '../redux/cartSlice';
```

## 👤 User State

### Selector
```javascript
const { 
  userDetail,      // User object: { _id, name, email, role, profilePic, ... }
  allUsers,        // Array of all users (admin only)
  loading,         // Boolean: true if fetching
  error,           // String: error message or null
  isAuthenticated  // Boolean: true if user logged in
} = useSelector(state => state.user);
```

### Actions & Thunks
```javascript
// Signup
dispatch(signupUser({ 
  email: 'user@example.com', 
  password: 'pass123',
  name: 'John',
  profilePic: '/path/to/pic'
}));

// Login
dispatch(loginUser({ 
  email: 'user@example.com', 
  password: 'pass123' 
}));

// Get current user profile
dispatch(fetchUserDetails());

// Get all users (admin)
dispatch(fetchAllUsers());

// Update user
dispatch(updateUser({ 
  name: 'Jane',
  email: 'jane@example.com'
}));

// Logout
dispatch(logoutUser());
```

## 📦 Products State

### Selector
```javascript
const { 
  products,          // Array of products
  filteredProducts,  // Products after filtering
  selectedProduct,   // Currently selected product
  loading,           // Boolean: true if fetching
  error,             // String: error message or null
  totalProducts      // Number: total product count
} = useSelector(state => state.products);
```

### Actions & Thunks
```javascript
// Fetch all products
dispatch(fetchAllProducts());

// Upload new product (admin)
const formData = new FormData();
formData.append('name', 'Product Name');
formData.append('price', 500);
formData.append('image', file); // File object
dispatch(uploadProduct(formData));

// Edit product (admin)
dispatch(editProduct({ 
  id: 'productId', 
  formData: updatedFormData 
}));

// Delete product (admin)
dispatch(deleteProduct('productId'));

// Filter by category
dispatch(fetchProductsByCategory('Electronics'));

// Set selected product
dispatch(setSelectedProduct(productObject));
```

## 🛒 Cart State

### Selector
```javascript
const { 
  cartItems,  // Array of items in cart
  cartCount,  // Number of items
  loading,    // Boolean: true if fetching
  error       // String: error message or null
} = useSelector(state => state.cart);
```

### Actions & Thunks
```javascript
// Fetch cart
dispatch(fetchCart());

// Add to cart
dispatch(addToCart('productId'));

// Remove from cart
dispatch(removeFromCart('productId'));

// Update cart count
dispatch(updateCartCount());
```

## 🔄 Complete Component Example

```javascript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, deleteProduct } from '../redux/productsSlice';
import { CircularProgress, Box, Button, Card } from '@mui/material';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Handle delete with error handling
  const handleDelete = async (productId) => {
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      console.log('Deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Render based on state
  if (loading) return <CircularProgress />;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <div>
      {products.map(product => (
        <Card key={product._id}>
          <h3>{product.name}</h3>
          <Button onClick={() => handleDelete(product._id)}>Delete</Button>
        </Card>
      ))}
    </div>
  );
};

export default ProductsPage;
```

## ⚠️ Common Mistakes

### ❌ Wrong: Not unwrapping async thunks
```javascript
dispatch(fetchData()); // No error handling!
```

### ✅ Correct: Using unwrap for error handling
```javascript
try {
  const result = await dispatch(fetchData()).unwrap();
} catch (error) {
  console.error('Failed:', error);
}
```

### ❌ Wrong: Not checking loading state
```javascript
<div>{data.items.map(item => <Item key={item.id} />)}</div>
```

### ✅ Correct: Checking loading state first
```javascript
{loading ? <Spinner /> : data.items.map(item => <Item key={item.id} />)}
```

### ❌ Wrong: Forgetting dispatch dependency
```javascript
useEffect(() => {
  dispatch(fetchData());
}, []); // Missing dispatch!
```

### ✅ Correct: Including dispatch in dependencies
```javascript
useEffect(() => {
  dispatch(fetchData());
}, [dispatch]); // Correct!
```

## 🎨 Styling Loading & Error States

```javascript
const { data, loading, error } = useSelector(state => state.slice);

return (
  <Box>
    {loading && (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    )}
    
    {error && (
      <Alert severity="error">
        {error}
      </Alert>
    )}
    
    {!loading && !error && (
      <Grid container>
        {/* Your content */}
      </Grid>
    )}
  </Box>
);
```

## 🧪 Testing Tips

### Test with Redux DevTools
1. Open browser DevTools → Redux tab
2. Watch actions dispatch
3. See state changes before/after
4. Time-travel through actions

### Test Error Handling
```javascript
// Simulate error in DevTools
// Dispatch action → See loading state
// Check error state when fails
```

## 📊 State Tree Structure

```javascript
{
  user: {
    userDetail: { _id, name, email, role, profilePic },
    allUsers: [],
    loading: false,
    error: null,
    isAuthenticated: true
  },
  products: {
    products: [],
    filteredProducts: [],
    selectedProduct: null,
    loading: false,
    error: null,
    totalProducts: 0
  },
  cart: {
    cartItems: [],
    loading: false,
    error: null,
    cartCount: 0
  }
}
```

## 🔗 Redux Flow

```
User Action (Button Click)
    ↓
Dispatch Thunk (dispatch(fetchData()))
    ↓
Async Thunk Executes (API Call)
    ↓
Reducer Updates State (.pending, .fulfilled, .rejected)
    ↓
Selector Gets Updated State
    ↓
Component Re-renders
```

## 💾 Accessing Current Redux State Manually

```javascript
// In browser console
// After installing Redux DevTools
const state = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?.()(
  configureStore({})
)().getState();
console.log(state.user);
console.log(state.products);
console.log(state.cart);
```

---

**Keep this guide handy for quick Redux lookups!**

Last Updated: June 1, 2026
