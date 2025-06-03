import React, {useEffect, useState} from 'react';
import orderService from "../../services/orderService.js";
import Pagination from "../../components/Pagination.jsx";
import OrderDetailsModal from "../../components/OrderDetailsModal.jsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useTranslations} from "../../contexts/LanguageContext.jsx";


const AccountOrders = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const t = useTranslations();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const currentPage = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const response = await orderService.getUserOrders({
                        page: currentPage - 1,
                        size: 10,
                        sortBy: 'id',
                        sortDir: 'desc'
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
        }, [searchParams]
    );

    const fetchOrderDetails = async (orderId) => {
        setLoadingDetails(true);
        try {
            const details = await orderService.getUserOrderDetails(orderId);
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

    const formatPaymentMethod = (method) => {
        const methods = {
            'CREDIT_CARD': t.creditCard,
            'PAYPAL': t.paypal
        };
        return methods[method] || method;
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
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-5">
            <div className="mb-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.orderHistory}</h3>
            </div>

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
                                {t.payment}
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${order.totalPrice.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatPaymentMethod(order.paymentMethod)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDate(order.placedOn)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => fetchOrderDetails(order.id)}
                                        disabled={loadingDetails}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {loadingDetails ? t.loading : t.details}
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

            <OrderDetailsModal
                isOpen={modalOpen}
                onClose={closeModal}
                orderDetails={selectedOrder}
                loading={loadingDetails}
            />
        </div>
    );
};

export default AccountOrders;