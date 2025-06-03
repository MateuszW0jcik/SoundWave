import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {Plus, Search} from 'lucide-react';
import Pagination from "../../components/Pagination.jsx";
import DynamicModal from "../../components/DynamicModal.jsx";
import shippingMethodService from "../../services/shippingMethodService.js";
import {useTranslations} from "../../contexts/LanguageContext.jsx"; // Adjust the path as needed

const DashboardShippingMethods = () => {
    const searchInputRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [shippingMethods, setShippingMethods] = useState([]);
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
            const response = await shippingMethodService.getShippingMethods({
                page: currentPage - 1,
                size: 10,
                sortBy: 'price',
                sortDir: 'asc',
                name: debouncedSearchTerm
            });
            setShippingMethods(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to fetch shipping methods:', error);
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

    const openShippingMethodModal = (shippingMethod = null) => {
        setModal({
            isOpen: true,
            type: 'shipping_method',
            title: shippingMethod ? t.editShippingMethod : t.addShippingMethod,
            fields: [
                { name: 'name', label: t.shippingMethodName, type: 'text', placeholder: t.enterShippingMethodName, required: true },
                { name: 'description', label: t.description, type: 'text', placeholder: t.enterDescription, required: true },
                { name: 'price', label: t.price, type: 'number', placeholder: '0.00', required: true, step: '0.01', min: 0}
            ],
            initialData: shippingMethod || {},
            editId: shippingMethod?.id || null
        });
    };

    const handleSave = async (formData) => {
        try {
            switch (modal.type) {
                case 'shipping_method':
                    if (modal.editId) {
                        await shippingMethodService.editShippingMethod(modal.editId, formData);
                    } else {
                        await shippingMethodService.addShippingMethod(formData);
                    }
                    await loadData();
                    break;
            }
        } catch (error) {
            throw error;
        }
    };

    const handleDelete = async () => {
        try {
            switch (modal.type) {
                case 'shipping_method':
                    if (modal.editId) {
                        await shippingMethodService.deleteShippingMethod(modal.editId);
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
                    onClick={() => openShippingMethodModal()}
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
                                {t.shippingMethodId}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.name}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.description}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.price}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.action}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {shippingMethods.map((shippingMethod) => (
                            <tr key={shippingMethod.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    #{shippingMethod.id}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 break-words">
                                    {shippingMethod.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 break-words">
                                    {shippingMethod.description}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {shippingMethod.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <button
                                        onClick={() => openShippingMethodModal(shippingMethod)}
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
                showDelete={modal.editId !== null && (modal.type === 'shipping_method')}
            />
        </div>
    );
};

export default DashboardShippingMethods;