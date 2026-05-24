import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App'
import Home from '../pages/Home.js';
import Login from '../pages/Login.js';
import Signup from '../pages/Signup.js';
import ForgotPassword from '../pages/ForgotPassword.js';
import Adminpanel from '../pages/Adminpanel.js';
import Allusers from '../pages/Allusers.js';
import Products from '../pages/Products.js';

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Navigate to="/sign-up" replace />

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