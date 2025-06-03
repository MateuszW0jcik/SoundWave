import React, {useState, useEffect} from 'react';
import {useSearchParams, useNavigate, Link} from 'react-router-dom';
import productService from '../../services/productService';
import brandService from '../../services/brandService';
import typeService from '../../services/typeService';
import Pagination from '../../components/Pagination';
import PriceFilter from '../../components/PriceFilter';
import BrandFilter from '../../components/BrandFilter';
import ConnectionTypeFilter from '../../components/ConnectionTypeFilter';
import TypeFilter from '../../components/TypeFilter';
import ProductCard from '../../components/ProductCard';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import {toast} from "react-toastify";
import {useAuth} from "../../contexts/AuthContext.jsx";
import {useCart} from "../../contexts/CartContext.jsx";
import {useLoginRegisterModal} from "../../contexts/LoginRegisterModalContext.jsx";
import {useTranslations} from "../../contexts/LanguageContext.jsx";

const ProductPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const t = useTranslations();

    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const [brands, setBrands] = useState([]);
    const [types, setTypes] = useState([]);
    const [priceRange, setPriceRange] = useState({min: 0, max: 1000});

    const {isAuthenticated} = useAuth();
    const {addUserShoppingCartItem} = useCart();
    const {openModal} = useLoginRegisterModal();

    const [expandedFilters, setExpandedFilters] = useState({
        price: true,
        brand: true,
        connectionType: true,
        type: true
    });
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

    const currentPage = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('size') || '9');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortDir = searchParams.get('sortDir') || 'asc';
    const selectedBrandId = searchParams.get('brandId') ?
        searchParams.get('brandId').split(',').map(id => parseInt(id)) : [];
    const selectedTypeId = searchParams.get('typeId') ?
        searchParams.get('typeId').split(',').map(id => parseInt(id)) : [];
    const selectedWireless = searchParams.get('wireless') || undefined;
    const minPrice = parseInt(searchParams.get('minPrice') || priceRange.min);
    const maxPrice = parseInt(searchParams.get('maxPrice') || priceRange.max);

    const getSortDisplay = () => {
        if (sortBy === 'price' && sortDir === 'asc') return t.priceAscending;
        if (sortBy === 'price' && sortDir === 'desc') return t.priceDescending;
        return t.default;
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            try {
                const productsResponse = await productService.getProducts({
                    page: currentPage - 1,
                    size: pageSize,
                    sortBy,
                    sortDir,
                    brandId: selectedBrandId.length > 0 ? selectedBrandId.join(',') : undefined,
                    typeId: selectedTypeId.length > 0 ? selectedTypeId.join(',') : undefined,
                    wireless: selectedWireless,
                    minPrice: searchParams.get('minPrice') || priceRange.min,
                    maxPrice: searchParams.get('maxPrice') || priceRange.max
                });

                setProducts(productsResponse.content);
                setTotalPages(productsResponse.totalPages);

                const allProducts = await productService.getProducts({size: 1000});
                const prices = allProducts.content.map(product => product.price);
                const min = Math.floor(Math.min(...prices));
                const max = Math.ceil(Math.max(...prices));
                setPriceRange({min, max});

                const brandsResponse = await brandService.getAllBrand();
                setBrands(brandsResponse);

                const typesResponse = await typeService.getAllTypes();
                setTypes(typesResponse);

            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [searchParams, t]);

    const toggleFilter = (filterName) => {
        setExpandedFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }));
    };

    const updateFilters = (key, value) => {
        const newParams = new URLSearchParams(searchParams);

        if (value === null || value === '') {
            newParams.delete(key);
        } else {
            newParams.set(key, value);
        }

        if (key !== 'page') {
            newParams.set('page', '1');
        }

        setSearchParams(newParams);
    };

    const updatePriceFilter = (minPrice, maxPrice) => {
        const newParams = new URLSearchParams(searchParams);

        newParams.set('minPrice', minPrice);
        newParams.set('maxPrice', maxPrice);
        newParams.set('page', '1');

        setSearchParams(newParams);
    }

    const handleSortChange = (sortValue) => {
        const newParams = new URLSearchParams(searchParams);

        if (sortValue === 'price_asc') {
            newParams.set('sortBy', 'price');
            newParams.set('sortDir', 'asc');
        } else if (sortValue === 'price_desc') {
            newParams.set('sortBy', 'price');
            newParams.set('sortDir', 'desc');
        } else {
            newParams.delete('sortBy');
            newParams.delete('sortDir');
        }

        setSearchParams(newParams);
        setSortDropdownOpen(false);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        updateFilters('page', newPage.toString());
        window.scrollTo(0, 0);
    };

    const clearAllFilters = () => {
        navigate('/products?page=1');
    };

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

    return (
        <>
            <Header/>

            <section className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb Path */}
                <div className="flex items-center text-sm mb-5 mt-5 flex-wrap">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                        {t.home} &gt;
                    </Link>
                    <span className="text-blue-500 font-bold ml-1"> {t.products}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 mb-10 relative">
                    {/* Filters Heading */}
                    <div className="relative h-10">
                        <div className="absolute bottom-0 left-0">
                            <h3 className="text-xl text-gray-800">{t.filters}</h3>
                        </div>
                        <div className="absolute bottom-0 right-0">
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                clearAllFilters();
                            }} className="text-blue-500 hover:text-blue-700">{t.clearAll}</a>
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="flex justify-end items-center gap-2 font-sans">
                        <span className="text-sm text-gray-500">{t.sortBy}</span>
                        <div className="relative inline-block w-48">
                            <div
                                className="w-full py-2 px-3 bg-white border border-gray-300 flex justify-between items-center cursor-pointer text-sm"
                                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                            >
                                <span>{getSortDisplay()}</span>
                                <i className={`border-solid border-black border-r-2 border-b-2 p-1 inline-block ${sortDropdownOpen ? 'rotate-[-135deg]' : 'rotate-45'} transition-transform`}></i>
                            </div>
                            {sortDropdownOpen && (
                                <div
                                    className="absolute top-full left-0 w-full bg-white border border-gray-300 border-t-0 z-50 shadow-md">
                                    <div
                                        className="p-2 cursor-pointer text-sm hover:bg-gray-100"
                                        onClick={() => handleSortChange('price_asc')}
                                    >
                                        {t.priceAscending}
                                    </div>
                                    <div
                                        className="p-2 cursor-pointer text-sm hover:bg-gray-100"
                                        onClick={() => handleSortChange('price_desc')}
                                    >
                                        {t.priceDescending}
                                    </div>
                                    <div
                                        className="p-2 cursor-pointer text-sm hover:bg-gray-100"
                                        onClick={() => handleSortChange('')}
                                    >
                                        {t.default}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="rounded-2xl p-5 h-fit w-full border border-gray-200">
                        <div className="w-full">
                            {/* Price Filter */}
                            <PriceFilter
                                expanded={expandedFilters.price}
                                toggleFilter={() => toggleFilter('price')}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                priceRange={priceRange}
                                updateFilters={updatePriceFilter}
                            />

                            {/* Brand Filter */}
                            <BrandFilter
                                expanded={expandedFilters.brand}
                                toggleFilter={() => toggleFilter('brand')}
                                brands={brands}
                                selectedBrandIds={selectedBrandId}
                                updateFilters={updateFilters}
                            />

                            {/* Connection Type Filter */}
                            <ConnectionTypeFilter
                                expanded={expandedFilters.connectionType}
                                toggleFilter={() => toggleFilter('connectionType')}
                                selectedWireless={selectedWireless}
                                updateFilters={updateFilters}
                            />

                            {/* Type Filter */}
                            <TypeFilter
                                expanded={expandedFilters.type}
                                toggleFilter={() => toggleFilter('type')}
                                types={types}
                                selectedTypeIds={selectedTypeId}
                                updateFilters={updateFilters}
                            />
                        </div>
                    </div>

                    {/* Content - Products */}
                    <div className="w-full max-w-full p-5">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                <div className="ml-4 text-lg">{t.loading}</div> {/* Added loading translation */}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-10">
                                <h3 className="text-lg font-medium text-gray-700">{t.noProductsFound}</h3>
                                <p className="text-gray-500">{t.tryChangingFilters}</p>
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

                    <div></div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        className="mb-5"
                    />
                </div>
            </section>

            <Footer/>

        </>
    );
};

export default ProductPage;