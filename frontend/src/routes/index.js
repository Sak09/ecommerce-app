import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App'
import Home from '../pages/Home.js';
import Login from '../pages/Login.js';
import Signup from '../pages/Signup.js';
import ForgotPassword from '../pages/ForgotPassword.js';
import Adminpanel from '../pages/Adminpanel.js';
import Allusers from '../pages/Allusers.js';
import Products from '../pages/Products.js';
import Shop from '../pages/Shop.js';
import Cart from '../pages/Cart.js';

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Navigate to="/home" replace />

            },
            {
                path :"home",
                element : <Home/>
            },
            {
                path :"login",
                element : <Login/>
            },

            {
                path :"sign-up",
                element : <Signup/>
            },
            {
                path :"forgot-password",
                element : <ForgotPassword/>
            },
            {
                path : "shop",
                element : <Shop/>
            },
            {
                path : "cart",
                element : <Cart/>
            },
            {
                path : 'admin-panel',
                element : <Adminpanel/>,
                children : [
                    {
                        path : 'all-users',
                        element : <Allusers/>
                    },
                    {
                        path : 'all-products',
                        element : <Products/>
                    }
                ]
            }
           
        
        ]
    }
])

export default router