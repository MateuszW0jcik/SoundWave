import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserRouter, Navigate, Outlet, RouterProvider} from 'react-router-dom';
import './index.css'
import {AuthProvider} from "./contexts/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import Account from "./pages/Account/Account.jsx";
import NotFound from "./pages/NotFound.jsx";
import AccountPersonalData from "./pages/Account/AccountPersonalData.jsx";
import AccountOrders from "./pages/Account/AccountOrders.jsx";
import AccountPayments from "./pages/Account/AccountPayments.jsx";
import AccountSecurity from "./pages/Account/AccountSecurity.jsx";
import AccountContact from "./pages/Account/AccountContact.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Checkout from "./pages/Cart/Checkout/Checkout.jsx";
import Payment from "./pages/Cart/Checkout/Payment/Payment.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import DashboardMessages from "./pages/Dashboard/DashboardMessages.jsx";
import DashboardProducts from "./pages/Dashboard/DashboardProducts.jsx";
import Products from "./pages/Products/Products.jsx";
import DashboardOrders from "./pages/Dashboard/DashboardOrders.jsx";
import DashboardUsers from "./pages/Dashboard/DashboardUsers.jsx";
import DashboardBrands from "./pages/Dashboard/DashboardBrands.jsx";
import DashboardTypes from "./pages/Dashboard/DashboardTypes.jsx";
import View from "./pages/Products/View/View.jsx";
import About from "./pages/About.jsx";
import FAQ from "./pages/FAQ.jsx";
import {ToastContainer} from "react-toastify";
import UserProtectedRoute from "./components/UserProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import DashboardShippingMethods from "./pages/Dashboard/DashboardShippingMethods.jsx";
import {CartProvider} from "./contexts/CartContext.jsx";
import {LoginRegisterModalProvider} from "./contexts/LoginRegisterModalContext.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import {LanguageProvider} from "./contexts/LanguageContext.jsx";
import OurPromises from "./pages/OurPromises.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <>
            <ScrollToTop/>
            <Outlet/>
        </>,
        errorElement: <NotFound/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: 'account',
                element: (
                    <UserProtectedRoute>
                        <Account/>
                    </UserProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <Navigate to="/account/personal data" replace/>
                    },
                    {
                        path: 'personal data',
                        element: <AccountPersonalData/>
                    },
                    {
                        path: 'orders',
                        element: <AccountOrders/>
                    },
                    {
                        path: 'payments',
                        element: <AccountPayments/>
                    },
                    {
                        path: 'security',
                        element: <AccountSecurity/>
                    },
                    {
                        path: 'contact',
                        element: <AccountContact/>
                    }
                ]
            },
            {
                path: 'cart',
                element: (
                    <UserProtectedRoute>
                        <Cart/>
                    </UserProtectedRoute>
                ),
            },
            {
                path: 'cart/checkout',
                element: (
                    <UserProtectedRoute>
                        <Checkout/>
                    </UserProtectedRoute>
                ),
            },
            {
                path: 'cart/checkout/payment',
                element: (
                    <UserProtectedRoute>
                        <Payment/>
                    </UserProtectedRoute>
                ),
            },
            {
                path: 'dashboard',
                element: (
                    <AdminProtectedRoute>
                        <Dashboard/>
                    </AdminProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <Navigate to="messages" replace/>
                    },
                    {
                        path: 'messages',
                        element: <DashboardMessages/>
                    },
                    {
                        path: 'orders',
                        element: <DashboardOrders/>
                    },
                    {
                        path: 'users',
                        element: <DashboardUsers/>
                    },
                    {
                        path: 'products',
                        element: <DashboardProducts/>
                    },
                    {
                        path: 'brands',
                        element: <DashboardBrands/>
                    },
                    {
                        path: 'types',
                        element: <DashboardTypes/>
                    },
                    {
                        path: 'shipping methods',
                        element: <DashboardShippingMethods/>
                    }
                ]
            },
            {
                path: 'products',
                element: <Products/>,
            },
            {
                path: 'products/view',
                element: <View/>,
            },
            {
                path: 'about',
                element: <About/>,
            },
            {
                path: 'contact',
                element: <Contact/>,
            },
            {
                path: 'faq',
                element: <FAQ/>,
            },
            {
                path: 'our promises',
                element: <OurPromises/>,
            }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <LanguageProvider>
            <AuthProvider>
                <LoginRegisterModalProvider>
                    <CartProvider>
                        <ToastContainer/>
                        <RouterProvider router={router}></RouterProvider>
                    </CartProvider>
                </LoginRegisterModalProvider>
            </AuthProvider>
        </LanguageProvider>
    </StrictMode>,
)
