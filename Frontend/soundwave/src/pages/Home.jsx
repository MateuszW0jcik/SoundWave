import React, {useState, useEffect} from 'react';
import Header from "../components/Header.jsx";
import HeroBannerSlider from "../components/HeroBannerSlider.jsx";
import ProductSlider from "../components/ProductSlider.jsx";
import productService from "../services/productService.js";
import {toast} from 'react-toastify';
import {Link} from "react-router-dom";
import Footer from "../components/Footer.jsx";
import {useAuth} from "../contexts/AuthContext.jsx";
import {useCart} from "../contexts/CartContext.jsx";
import {useLoginRegisterModal} from "../contexts/LoginRegisterModalContext.jsx";
import {useTranslations} from "../contexts/LanguageContext.jsx"; // Adjust the path as needed

const Home = () => {
    const [newProducts, setNewProducts] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {isAuthenticated} = useAuth();
    const {addUserShoppingCartItem} = useCart();
    const {openModal} = useLoginRegisterModal();
    const t = useTranslations(); // Initialize useTranslations hook

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const newProductsData = await productService.getNewProducts();
                setNewProducts(newProductsData);

                const bestSellersData = await productService.getBestSellersProducts();
                setBestSellers(bestSellersData);

            } catch (err) {
                setError(t.failedToLoadProducts);
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [t]); // Added t to dependency array

    const handleAddToCart = async (productId) => {
        if (isAuthenticated) {
            try {
                await addUserShoppingCartItem({
                    productId: productId,
                    quantity: 1
                });
                toast.success(t.productAddedToCartSuccessfully);
            } catch (error) {
                toast.error(t.failedToAddProductToCart);
            }
        } else {
            openModal();
        }
    };

    if (loading) {
        return (
            <>
                <Header/>
                <HeroBannerSlider/>

                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <div className="ml-4 text-lg">{t.loading}</div>
                </div>

                <Link to={`/products`}>
                    <img
                        src="src/assets/banners/banner4.jpg"
                        className="block w-full max-w-7xl mx-auto mb-4 p-4"
                        alt={t.banner4Alt}/>
                </Link>

                <section className="px-4 py-8 max-w-7xl mx-auto" aria-label={t.topBrands}>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold">{t.topBrands}</h2>
                    </div>
                    <div
                        className="flex flex-wrap justify-center sm:justify-between items-center gap-6 sm:gap-10 md:gap-12 py-5 unselectable">
                        <img src="src/assets/producers/sennheiser-logo.png" alt={t.sennheiser}
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/sony-logo.png" alt={t.sony}
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/beats-logo.png" alt={t.beats}
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/bose-logo.png" alt={t.bose}
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/jbl-logo.png" alt={t.jbl}
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/akg-logo.svg" alt={t.akg}
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/apple-logo.png" alt={t.apple}
                             className="h-8 sm:h-10 object-contain select-none"/>
                    </div>
                </section>


                <Footer/>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header/>
                <HeroBannerSlider/>

                <div className="flex justify-center items-center py-20">
                    <div className="text-lg text-red-500">{error}</div>
                </div>

                <Link to={`/products`}>
                    <img
                        src="src/assets/banners/banner4.jpg"
                        className="block w-full max-w-7xl mx-auto mb-4 p-4"
                        alt={t.banner4Alt}/>
                </Link>

                <section className="px-4 py-8 max-w-7xl mx-auto" aria-label={t.topBrands}>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold">{t.topBrands}</h2>
                    </div>
                    <div
                        className="flex flex-wrap justify-center sm:justify-between items-center gap-6 sm:gap-10 md:gap-12 py-5 unselectable">
                        <img src="src/assets/producers/sennheiser-logo.png" alt={t.sennheiser}
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/sony-logo.png" alt={t.sony}
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/beats-logo.png" alt={t.beats}
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/bose-logo.png" alt={t.bose}
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/jbl-logo.png" alt={t.jbl}
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/akg-logo.svg" alt={t.akg}
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/apple-logo.png" alt={t.apple}
                             className="h-8 sm:h-10 object-contain select-none"/>
                    </div>
                </section>


                <Footer/>
            </>
        );
    }

    return (
        <>
            <Header/>
            <HeroBannerSlider/>

            {newProducts.length > 0 && (
                <ProductSlider
                    title={t.newProducts}
                    products={newProducts}
                    onAddToCart={handleAddToCart}
                />
            )}

            {bestSellers.length > 0 && (
                <ProductSlider
                    title={t.bestSellers}
                    products={bestSellers}
                    onAddToCart={handleAddToCart}
                />
            )}

            <Link to={`/products`}>
                <img
                    src="src/assets/banners/banner4.jpg"
                    className="block w-full max-w-7xl mx-auto mb-4 p-4"
                    alt={t.banner4Alt}/>
            </Link>

            <section className="px-4 py-8 max-w-7xl mx-auto" aria-label={t.topBrands}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold">{t.topBrands}</h2>
                </div>
                <div
                    className="flex flex-wrap justify-center sm:justify-between items-center gap-6 sm:gap-10 md:gap-12 py-5 unselectable">
                    <img src="src/assets/producers/sennheiser-logo.png" alt={t.sennheiser}
                         className="h-8 sm:h-10 object-contain select-none"/>
                    <img src="src/assets/producers/sony-logo.png" alt={t.sony}
                         className="h-8 sm:h-10 object-contain select-none"/>
                    <img src="src/assets/producers/beats-logo.png" alt={t.beats}
                         className="h-8 sm:h-10 object-contain select-none"/>
                    <img src="src/assets/producers/bose-logo.png" alt={t.bose}
                         className="h-8 sm:h-10 object-contain select-none"/>
                    <img src="src/assets/producers/jbl-logo.png" alt={t.jbl}
                         className="h-8 sm:h-10 object-contain select-none"/>
                    <img src="src/assets/producers/akg-logo.svg" alt={t.akg}
                         className="h-8 sm:h-10 object-contain select-none"/>
                    <img src="src/assets/producers/apple-logo.png" alt={t.apple}
                         className="h-8 sm:h-10 object-contain select-none"/>
                </div>
            </section>


            <Footer/>
        </>
    )
}

export default Home;