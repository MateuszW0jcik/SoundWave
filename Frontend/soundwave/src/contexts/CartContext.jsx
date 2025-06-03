import React, {createContext, useContext, useState, useEffect} from 'react';
import shoppingCartService from "../services/shoppingCartService.js";
import {useAuth} from "./AuthContext.jsx";

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);
    const [itemsCount, setItemsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const {isAuthenticated} = useAuth();
    const subTotal = cartItems?.reduce((total, item) => {
        return total + (parseFloat(item.product.price) * parseInt(item.quantity));
    }, 0) || 0;

    useEffect(() => {
        loadUserShoppingCartItems();
    }, [isAuthenticated]);

    const loadUserShoppingCartItems = async () => {
        try {
            if (isAuthenticated) {
                const cartData = await shoppingCartService.getUserShoppingCartItems();
                setCartItems(cartData);
                if (cartData) {
                    setItemsCount(cartData.length);
                } else {
                    setItemsCount(0);
                }
            }else {
                setItemsCount(0);
            }
        } catch (error) {
            console.error('Failed to get cart data:', error);
            setItemsCount(0);
        } finally {
            setLoading(false);
        }
    }

    const updateUserShoppingCartItem = async (request) => {
        try {
            await shoppingCartService.updateUserShoppingCartItem({
                id: request.id,
                newQuantity: request.newQuantity
            });
            await loadUserShoppingCartItems();
        } catch (error) {
            throw error;
        }
    };

    const addUserShoppingCartItem = async (shoppingCartItemRequest) => {
        try {
            await shoppingCartService.addUserShoppingCartItem({
                productId: shoppingCartItemRequest.productId,
                quantity: shoppingCartItemRequest.quantity
            });
            await loadUserShoppingCartItems();
        } catch (error) {
            throw error;
        }
    };

    const deleteUserShoppingCartItem = async (id) => {
        try {
            await shoppingCartService.deleteUserShoppingCartItem(id);
            await loadUserShoppingCartItems();
        } catch (error) {
            throw error;
        }
    };

    const value = {
        cartItems,
        itemsCount,
        loading,
        subTotal,
        loadUserShoppingCartItems,
        addUserShoppingCartItem,
        deleteUserShoppingCartItem,
        updateUserShoppingCartItem,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};