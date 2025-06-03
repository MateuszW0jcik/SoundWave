import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {Plus, Search} from "lucide-react";
import Pagination from "../../components/Pagination.jsx";
import DynamicModal from "../../components/DynamicModal.jsx";
import productService from "../../services/productService.js";
import brandService from "../../services/brandService.js";
import typeService from "../../services/typeService.js";
import {useTranslations} from "../../contexts/LanguageContext.jsx"; // Adjust the path as needed

const DashboardProducts = () => {
    const searchInputRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const currentPage = parseInt(searchParams.get('page') || '1');
    const t = useTranslations(); // Initialize useTranslations hook

    const [modal, setModal] = useState({
        isOpen: false,
        type: '',
        title: '',
        fields: [],
        initialData: {},
        editId: null
    });

    const closeModal = () => {
        setModal({
            isOpen: false,
            type: '',
            title: '',
            fields: [],
            initialData: {},
            editId: null
        });
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        if (!loading && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [loading]);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await productService.getProducts({
                page: currentPage - 1,
                size: 10,
                sortBy: 'name',
                sortDir: 'asc',
                name: debouncedSearchTerm
            });
            const productsWithImages = await fetchImagesForProducts(response.content);
            setProducts(productsWithImages);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
            loadData();
        }, [debouncedSearchTerm, searchParams]
    );

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', newPage);
        setSearchParams(newParams);
        window.scrollTo(0, 0);
    };

    const fetchImagesForProducts = async (products) => {
        const updated = await Promise.all(
            products.map(async (product) => {
                try {
                    const blob = await productService.getProductImage(product.id);
                    const url = URL.createObjectURL(blob);
                    return {...product, imageUrl: url};
                } catch (e) {
                    return {...product, imageUrl: null};
                }
            })
        );
        return updated;
    };

    const openProductModal = async (product = null) => {
        try {
            const [brands, types] = await Promise.all([
                brandService.getAllBrand(),
                typeService.getAllTypes(),
            ]);

            setModal({
                isOpen: true,
                type: 'product',
                title: product ? t.editProduct : t.addProduct,
                fields: [
                    {name: 'name', label: t.name, type: 'text', placeholder: t.enterName, required: true},
                    {
                        name: 'description',
                        label: t.description,
                        type: 'textarea',
                        placeholder: t.enterDescription,
                        required: true
                    },
                    {
                        name: 'brandName',
                        label: t.brand,
                        type: 'select',
                        options: brands,
                        getOptionLabel: (b) => b.name,
                        getOptionValue: (b) => b.name,
                        required: true
                    },
                    {
                        name: 'typeName',
                        label: t.type,
                        type: 'select',
                        options: types,
                        getOptionLabel: (tOption) => tOption.name, // Renamed t to tOption to avoid conflict with translation function
                        getOptionValue: (tOption) => tOption.name,
                        required: true
                    },
                    {
                        name: 'wireless',
                        label: t.wireless,
                        type: 'select',
                        options: [
                            {label: t.yes, value: 'true'},
                            {label: t.no, value: 'false'},
                        ],
                        getOptionLabel: (option) => option.label,
                        getOptionValue: (option) => option.value,
                        required: true,
                    },
                    {
                        name: 'price',
                        label: t.price,
                        type: 'number',
                        placeholder: '0.00',
                        step: 0.01,
                        min: 0.0,
                        required: true
                    },
                    {name: 'quantity', label: t.quantity, type: 'number', placeholder: '0', min: 0, required: true},
                    {name: 'image', label: t.image, type: 'file', required: !product},
                ],
                initialData: product
                    ? {
                        ...product,
                        wireless: String(product.wireless),
                    } : {},
                editId: product?.id || null,
            });
        } catch (error) {
            console.error('Failed to open modal:', error);
        }
    };

    const handleSave = async (formData) => {
        try {
            const requestData = new FormData();

            const productRequest = {
                name: formData.name,
                description: formData.description,
                brandName: formData.brandName,
                typeName: formData.typeName,
                wireless: formData.wireless === 'true' || formData.wireless === true,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity)
            };

            requestData.append('request', new Blob([JSON.stringify(productRequest)], {
                type: 'application/json'
            }));

            if (formData.image && formData.image instanceof File) {
                requestData.append('image', formData.image);
            } else if (!modal.editId) {
                throw new Error(t.imageRequiredForNewProducts);
            }

            if (modal.editId) {
                await productService.editProduct(modal.editId, requestData);
            } else {
                await productService.addProduct(requestData);
            }

            await loadData();
        } catch (error) {
            throw error;
        }
    };

    const handleDelete = async () => {
        try {
            switch (modal.type) {
                case 'product':
                    if (modal.editId) {
                        await productService.deleteProduct(modal.editId);
                        await loadData();
                    }
                    break;
            }
        } catch (error) {
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="ml-4 text-lg">{t.loading}</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-5">
            <div className="flex items-center w-full gap-2 mb-4">
                <div className="flex items-center flex-1 border border-gray-300 rounded px-3 py-2 bg-white">
                    <Search className="w-5 h-5 mr-2 text-gray-500"/>
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t.searchByName}
                        autoComplete="off"
                        className="flex-1 outline-none bg-transparent text-sm"
                    />
                </div>

                <button
                    onClick={() => openProductModal()}
                    className="w-9 h-9 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:scale-105 transition-transform flex items-center justify-center cursor-pointer"
                >
                    <Plus className="w-4 h-4"/>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.productId}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.image}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.name}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.type}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.brand}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.price}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.quantity}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.action}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    #{product.id}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <img
                                        src={product.imageUrl || 'https://dummyimage.com/80x80/ffffff/000000.png&text=No+Image'}
                                        alt={product.name}
                                        className="w-20 h-20 object-contain select-none"
                                        loading="lazy"
                                    />
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 break-words">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 break-words">
                                    {product.typeName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 break-words">
                                    {product.brandName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {product.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {product.quantity}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <button
                                        onClick={() => openProductModal(product)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {t.edit}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-6"
            />

            <DynamicModal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                fields={modal.fields}
                initialData={modal.initialData}
                onSave={handleSave}
                onDelete={handleDelete}
                showDelete={modal.editId !== null && (modal.type === 'product')}
            />
        </div>
    );
};

export default DashboardProducts;