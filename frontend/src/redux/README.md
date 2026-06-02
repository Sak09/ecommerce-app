# Redux Setup Documentation

## Overview
This ecommerce application now uses Redux Toolkit for state management. Redux provides a centralized state management solution for handling user authentication, products, and shopping cart data.

## Project Structure

### Redux Store Files
```
frontend/src/redux/
├── store.js                 # Redux store configuration
├── userSlice.js            # User authentication state
├── productsSlice.js        # Products state
└── cartSlice.js            # Shopping cart state
```

## Store Configuration (store.js)

The Redux store is configured with three slices:
- **user**: Manages user authentication and profile data
- **products**: Manages product listing and management
- **cart**: Manages shopping cart operations

## Slices Overview

### 1. User Slice (userSlice.js)

**State Properties:**
- `userDetail`: Current logged-in user's profile data
- `allUsers`: List of all users (admin feature)
- `loading`: Loading state for async operations
- `error`: Error messages
- `isAuthenticated`: Boolean flag for authentication status

**Async Thunks:**
- `signupUser`: Register new user
- `loginUser`: Authenticate user
- `fetchUserDetails`: Get current user profile
- `updateUser`: Update user information
- `fetchAllUsers`: Fetch all users (admin)
- `logoutUser`: Logout current user

**Usage Example:**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, fetchUserDetails } from '../redux/userSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { userDetail, isAuthenticated, loading } = useSelector(state => state.user);
  
  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);
  
  const handleLogin = async (credentials) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      // User logged in successfully
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return <div>{isAuthenticated && <p>Welcome {userDetail?.name}!</p>}</div>;
};
```

### 2. Products Slice (productsSlice.js)

**State Properties:**
- `products`: Array of all products
- `filteredProducts`: Products filtered by category or search
- `selectedProduct`: Currently selected product
- `loading`: Loading state
- `error`: Error messages
- `totalProducts`: Total count of products

**Async Thunks:**
- `fetchAllProducts`: Get all products
- `uploadProduct`: Create new product (admin)
- `editProduct`: Update product details (admin)
- `deleteProduct`: Delete product (admin)
- `fetchProductsByCategory`: Filter products by category

**Usage Example:**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, deleteProduct } from '../redux/productsSlice';

const ProductsComponent = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);
  
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  
  const handleDeleteProduct = async (productId) => {
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      console.log('Product deleted');
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };
  
  return (
    <div>
      {loading ? <CircularProgress /> : products.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  );
};
```

### 3. Cart Slice (cartSlice.js)

**State Properties:**
- `cartItems`: Array of items in cart
- `loading`: Loading state
- `error`: Error messages
- `cartCount`: Number of items in cart

**Async Thunks:**
- `fetchCart`: Get current user's cart
- `addToCart`: Add product to cart
- `removeFromCart`: Remove product from cart

**Usage Example:**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, addToCart, removeFromCart } from '../redux/cartSlice';

const CartComponent = () => {
  const dispatch = useDispatch();
  const { cartItems, cartCount, loading } = useSelector(state => state.cart);
  
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
  
  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addToCart(productId)).unwrap();
      console.log('Added to cart');
    } catch (error) {
      console.error('Add to cart failed:', error);
    }
  };
  
  return <div>Cart Items: {cartCount}</div>;
};
```

## Connected Components

The following components have been updated to use Redux:

1. **Header.js** - User authentication, cart badge, navigation
2. **Home.js** - Role-based redirection
3. **Login.js** - User login functionality
4. **Signup.js** - User registration
5. **Products.js** - Admin product management
6. **Shop.js** - Customer product browsing and cart
7. **Cart.js** - Shopping cart management
8. **Allusers.js** - Admin user management

## How to Connect New Components

### Step 1: Import Redux Hooks
```javascript
import { useDispatch, useSelector } from 'react-redux';
```

### Step 2: Use Dispatch and Selector
```javascript
const MyComponent = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.sliceName);
  
  // Use dispatch to trigger async thunks or actions
  useEffect(() => {
    dispatch(asyncThunk());
  }, [dispatch]);
  
  return <div>{/* Your JSX */}</div>;
};
```

### Step 3: Common Patterns

**Accessing User Data:**
```javascript
const { userDetail, isAuthenticated, loading } = useSelector(state => state.user);
```

**Accessing Products:**
```javascript
const { products, loading, error } = useSelector(state => state.products);
```

**Accessing Cart:**
```javascript
const { cartItems, cartCount, loading } = useSelector(state => state.cart);
```

## Token Management

The Redux store handles authentication tokens stored in cookies:
- Token is read from `access-token` cookie
- Token is automatically included in all API requests via headers
- Logout clears the token and resets user state

## Error Handling

Each slice includes error handling:
```javascript
try {
  const result = await dispatch(asyncThunk(data)).unwrap();
  // Handle success
} catch (error) {
  console.error('Operation failed:', error);
  // Handle error
}
```

## Best Practices

1. **Always use `.unwrap()`** when dispatching async thunks to access the actual result
2. **Check loading state** before rendering data to show loading indicators
3. **Handle errors gracefully** with user-friendly error messages
4. **Dispatch on mount** to fetch initial data using `useEffect`
5. **Use selectors** to access state instead of accessing state directly

## Redux DevTools

For debugging, you can use Redux DevTools browser extension:
1. Install Redux DevTools extension in your browser
2. The store is automatically configured to work with it
3. Open DevTools and select "Redux" tab to inspect state changes

## API Integration

All async thunks connect to the backend API defined in `src/common/index.js`:
- Requests include proper headers (Content-Type, Authorization)
- Credentials are included for cookie-based auth
- Error responses are properly handled

## Transitioning from Context API

If you were previously using Context API, replace:
```javascript
// Old (Context API)
const { userDetail } = useContext(AuthContext);

// New (Redux)
const { userDetail } = useSelector(state => state.user);
```

And replace:
```javascript
// Old (Context API)
const { fetchUserDetails } = useContext(AuthContext);

// New (Redux)
const dispatch = useDispatch();
useEffect(() => {
  dispatch(fetchUserDetails());
}, [dispatch]);
```

## Future Enhancements

- Add Redux persisting (persist cart/user across page refreshes)
- Implement Redux middleware for logging
- Add more advanced filtering and search functionality
- Implement order management slice
- Add notifications slice for toast messages

---

**Last Updated:** June 1, 2026
