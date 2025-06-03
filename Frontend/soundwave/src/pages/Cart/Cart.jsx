import React, {useState} from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import {useCart} from "../../contexts/CartContext.jsx";
import CartProductItem from "../../components/CartProductItem.jsx";
import CartImage from "../../assets/cart-path/cart.png"
import {Link} from "react-router-dom";
import {useTranslations} from "../../contexts/LanguageContext.jsx";

const Cart = () => {
    const [loading, setLoading] = useState(false);
    const { cartItems, subTotal, deleteUserShoppingCartItem, updateUserShoppingCartItem } = useCart();
    const t = useTranslations();

    const handleQuantityDecrease = async (item) => {
        if (item.quantity > 1 && !loading) {
            setLoading(true);
            try {
                await updateUserShoppingCartItem({
                    id: item.id,
                    newQuantity: item.quantity - 1
                });
            } catch (error) {
                console.error('Error decreasing quantity:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleQuantityIncrease = async (item) => {
        if (!loading) {
            setLoading(true);
            try {
                await updateUserShoppingCartItem({
                    id: item.id,
                    newQuantity: item.quantity + 1
                });
            } catch (error) {
                console.error('Error increasing quantity:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRemoveProduct = async (item) => {
        if (!loading) {
            setLoading(true);
            try {
                await deleteUserShoppingCartItem(item.id);
            } catch (error) {
                console.error('Error removing product:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    if(loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="ml-4 text-lg">{t.loading}</div>
            </div>
        )
    }

    return (
        <>
            <Header/>

            <div className="max-w-5xl mx-auto p-5 flex justify-center">
                <div className="w-full">
                    <div className="my-8 mb-12">
                        <img
                            src={CartImage}
                            alt="Cart path"
                            className="select-none mx-auto"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-5 relative">
                        <div className="lg:col-span-2">
                            {cartItems.length === 0 ? (
                                <p className="text-center text-gray-500">{t.noProductsInCart}</p>
                            ) : (
                                cartItems.map((item) => (
                                    <CartProductItem
                                        key={item.id}
                                        item={item}
                                        loading={loading}
                                        onQuantityDecrease={handleQuantityDecrease}
                                        onQuantityIncrease={handleQuantityIncrease}
                                        onRemoveProduct={handleRemoveProduct}
                                    />
                                ))
                            )}
                        </div>

                        <div
                            className="rounded-2xl p-4 pb-5 h-fit w-full min-w-[400px] box-border border border-gray-200">
                            <h3 className="text-2xl font-semibold mb-4">{t.paymentDetails}</h3>
                            <div className="flex justify-between my-3 text-sm">
                                <span>{t.subtotal}</span>
                                <span>${subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between my-3 text-sm">
                                <span>{t.shipmentCost}</span>
                                <span>??</span>
                            </div>
                            <hr className="my-4 border-gray-200"/>
                            <h4 className="flex justify-between text-lg font-semibold mt-5">
                                <span>{t.grandTotal}</span>
                                <span>${subTotal.toFixed(2)}</span>
                            </h4>
                            <div>
                                <Link
                                    to="/cart/checkout"
                                    disabled={cartItems.length === 0 || loading}
                                    className="block w-full bg-blue-600 text-white border-none rounded px-6 py-3 text-base font-bold cursor-pointer mt-4 transition-transform hover:scale-105 text-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {loading ? t.processing : t.proceedToCheckout}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </>
    );
};

export default Cart;