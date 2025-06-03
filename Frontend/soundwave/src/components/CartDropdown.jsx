import React from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from "../contexts/AuthContext.jsx";
import {useCart} from "../contexts/CartContext.jsx";
import ProductInCart from "./ProductInCart.jsx";
import {useTranslations} from "../contexts/LanguageContext.jsx";

const CartDropdown = ({isOpen, onClose}) => {
    const {isAuthenticated} = useAuth();
    const {cartItems, subTotal, itemsCount, deleteUserShoppingCartItem} = useCart();
    const t = useTranslations();

    if (!isAuthenticated) return null;

    return (
        <div
            className={`absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg transition-all duration-200 z-[1000] px-6 py-6 max-h-[500px] font-sans
        ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2.5'}
      `}
        >
            <div className="mb-4">
                <h3 className="text-xl font-bold">{t.itemsCount.replace('{{count}}', itemsCount)}</h3>
            </div>

            <div className="max-h-[300px] overflow-y-auto mb-3 pt-1">
                {cartItems?.length === 0 ? (
                    <p className="text-gray-600">{t.noProductsInCart}</p>
                ) : (
                    <div className="space-y-2.5">
                        {cartItems.map((item) => (
                            <ProductInCart
                                key={item.id}
                                shoppingCartItem={item}
                                onRemove={() => deleteUserShoppingCartItem(item.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
            {cartItems?.length > 0 && (
                <div>
                    <p className="text-lg font-bold mb-4">{t.grandTotal$.replace('{{total}}', subTotal.toFixed(2))}</p>
                    <Link to='/cart'
                          className="block text-center w-full text-white font-bold py-3 px-6 rounded text-base transition-transform hover:scale-105 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                          onClick={onClose}>
                        {t.processToCart}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CartDropdown;