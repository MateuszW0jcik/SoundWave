import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import orderService from "../../services/orderService.js";
import Pagination from "../../components/Pagination.jsx";
import OrderDetailsModal from "../../components/OrderDetailsModal.jsx";
import {Search} from 'lucide-react';
import {useTranslations} from "../../contexts/LanguageContext.jsx";

const DashboardOrders = () => {
    const searchInputRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const currentPage = parseInt(searchParams.get('page') || '1');
    const t = useTranslations();

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

    useEffect(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const response = await orderService.getAllOrders({
                        page: currentPage - 1,
                        size: 10,
                        sortBy: 'id',
                        sortDir: 'desc',
                        ownerName: debouncedSearchTerm
                    });
                    setOrders(response.content);
                    setTotalPages(response.totalPages);
                } catch (error) {
                    console.error('Failed to fetch orders:', error);
                } finally {
                    setLoading(false);
                }

            };

            loadData();
        }, [debouncedSearchTerm, searchParams]
    );

    const fetchOrderDetails = async (orderId) => {
        setLoadingDetails(true);
        try {
            const details = await orderService.getOrderDetails(orderId);
            setSelectedOrder(details);
            setModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch order details:', error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', newPage);
        setSearchParams(newParams);
        window.scrollTo(0, 0);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
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
            <div className="flex items-center w-full border border-gray-300 rounded px-3 py-2 bg-white mb-4">
                <Search
                    alt={t.search}
                    className="w-5 h-5 mr-2 select-none"
                />
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.searchByUser}
                    autoComplete="off"
                    className="flex-1 outline-none bg-transparent text-sm"
                />
            </div>
            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.orderId}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.totalPrice}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.user}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.placedOn}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.action}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    #{order.id}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    ${order.totalPrice.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 break-words">
                                    {order.owner}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDate(order.placedOn)}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <button
                                        onClick={() => fetchOrderDetails(order.id)}
                                        disabled={loadingDetails}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {loadingDetails ? t.loadingDetails : t.details}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-6"
            />

            {/* Order Details Modal */}
            <OrderDetailsModal
                isOpen={modalOpen}
                onClose={closeModal}
                orderDetails={selectedOrder}
                loading={loadingDetails}
            />
        </div>
    );
};

export default DashboardOrders;