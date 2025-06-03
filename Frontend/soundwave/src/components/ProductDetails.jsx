import React, {useEffect, useState} from 'react';
import {Link, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {useAuth} from "../contexts/AuthContext.jsx";
import {useCart} from "../contexts/CartContext.jsx";
import {useLoginRegisterModal} from "../contexts/LoginRegisterModalContext.jsx";
import {useTranslations} from "../contexts/LanguageContext.jsx";
import {productService} from "../services/productService.js";


const ProductDetails = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [id, setId] = useState("");
    const t = useTranslations();

    useEffect(() => {
        setId(searchParams.get("id"));
    }, [searchParams]);

    const [product, setProduct] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {isAuthenticated} = useAuth();
    const {addUserShoppingCartItem} = useCart();
    const {openModal} = useLoginRegisterModal();

    useEffect( () => {
        const getProduct = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data);
                await fetchImage(data.id);
            } catch (err) {
                setError(t.failedToLoadProduct);
            } finally {
                setLoading(false);
            }
        };

        const fetchImage = async (productId) => {
            try {
                const imageBlob = await productService.getProductImage(productId);
                const url = URL.createObjectURL(imageBlob);
                setImageURL(url);
            } catch (error) {
                console.error('Error fetching product image:', error);
                setImageURL(null);
            }
        };

        if (id) {
            getProduct();
        }

        return () => {
            if (imageURL) {
                URL.revokeObjectURL(imageURL);
            }
        };
    }, [id, t]);

    const handleAddToCart = async () => {
        if (isAuthenticated) {
            try {
                await addUserShoppingCartItem({
                    productId: product.id,
                    quantity: 1
                });
                toast.success(t.productAddedToCart);
            } catch (error) {
                toast.error(t.failedAddToCart);
            }
        } else {
            openModal();
        }
    }

    if (!id) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg">{t.productNotFound}</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg">{t.productNotFound}</p>
            </div>
        );
    }

    const labels = [t.producer, t.type, t.connectionType];
    const names = ['brandName', 'typeName', 'wireless'];

    return (
        <section className="max-w-7xl mx-auto px-4">
            <div className="flex items-center text-sm mb-5 mt-5 flex-wrap">
                <Link to="/" className="text-gray-500 hover:text-gray-700">
                    {t.home} &gt;
                </Link>
                <Link to="/products" className="text-gray-500 hover:text-gray-700 ml-1">
                    {t.products} &gt;
                </Link>
                <span className="text-blue-500 font-bold ml-1">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-5">
                <img
                    src={imageURL || `https://dummyimage.com/1280x1280/ffffff/000000.png&text=${t.loading}`}
                    alt={t.productImage}
                    className="w-full aspect-square object-contain max-h-96 select-none"
                    loading="lazy"
                />

                <div className="flex flex-col gap-4">
                    <h3 className="text-4xl font-semibold m-0">{product.name}</h3>
                    <p className="m-0">{product.description}</p>
                    <p className="m-0">${product.price.toFixed(2)}</p>
                    <div className="mt-1">
                        <button
                            className="w-full text-white border-none py-2 px-4 rounded cursor-pointer transition-colors duration-300"
                            onClick={handleAddToCart}
                            style={{backgroundColor: '#333'}}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#000'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#333'}
                            type="button"
                        >
                            {t.addToCart}
                        </button>
                    </div>
                </div>

                <div className="flex-col">
                    <h3 className="text-xl font-semibold mb-4">{t.technicalDetails}</h3>
                    <table className="w-full border-collapse bg-white shadow-sm">
                        <tbody>
                        {labels.map((label, index) => (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="py-3 px-4 text-gray-700">{label}</td>
                                <td className="py-3 px-4 text-gray-700">
                                    {names[index] === 'wireless'
                                        ? (product[names[index]] ? t.wireless : t.wired)
                                        : product[names[index]]}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default ProductDetails;