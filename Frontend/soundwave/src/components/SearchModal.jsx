import React, {useEffect, useRef, useState} from 'react';
import {X, Search} from 'lucide-react';
import ProductCard from "./ProductCard.jsx";
import {toast} from "react-toastify";
import {useAuth} from "../contexts/AuthContext.jsx";
import {useCart} from "../contexts/CartContext.jsx";
import {useLoginRegisterModal} from "../contexts/LoginRegisterModalContext.jsx";
import productService from "../services/productService.js";
import {useTranslations} from "../contexts/LanguageContext.jsx";

const SearchModal = ({isOpen, onClose}) => {
    const searchInputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [clickedOnOverlay, setClickedOnOverlay] = useState(false);
    const [products, setProducts] = useState([]);
    const t = useTranslations();

    const {isAuthenticated} = useAuth();
    const {addUserShoppingCartItem} = useCart();
    const {openModal} = useLoginRegisterModal();

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
            if(debouncedSearchTerm!==''){
                loadData();
            }else {
                setProducts([]);
            }
        }, [debouncedSearchTerm]
    );

    const loadData = async () => {
        try {
            const response = await productService.getProducts({
                page: 0,
                size: 6,
                sortBy: 'name',
                sortDir: 'asc',
                name: debouncedSearchTerm
            });
            setProducts(response.content);
        } catch (error) {
            console.error('Failed to fetch brands:', error);
        }
    };

    const handleMouseDown = (e) => {
        if (e.target === e.currentTarget) {
            setClickedOnOverlay(true);
        } else {
            setClickedOnOverlay(false);
        }
    };

    const handleMouseUp = (e) => {
        if (clickedOnOverlay && e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleAddToCart = async (productId) => {
        if (isAuthenticated) {
            try {
                await addUserShoppingCartItem({
                    productId: productId,
                    quantity: 1
                });
                toast.success(t.productAddedToCart);
            } catch (error) {
                toast.error(t.failedToAddToCart);
            }
        } else {
            openModal();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
             onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <div className="bg-white rounded-lg w-full max-w-5xl mx-4 shadow-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6">
                    <div className="flex items-center flex-1 border border-gray-300 rounded px-3 py-2 bg-white mr-4">
                        <Search className="w-5 h-5 mr-2 text-gray-500"/>
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t.searchPlaceholder}
                            autoComplete="off"
                            className="flex-1 outline-none bg-transparent text-sm"
                        />
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <X size={20} className="text-gray-600 cursor-pointer"/>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {products.length === 0 ? (
                        <div className="text-center py-10">
                            <h3 className="text-lg font-medium text-gray-700">{t.noProductsFound}</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={() => handleAddToCart(product.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;