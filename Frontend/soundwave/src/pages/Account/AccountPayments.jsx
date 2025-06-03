import React, {useEffect, useState} from 'react';
import paymentService from "../../services/paymentService.js";
import DynamicModal from "../../components/DynamicModal.jsx";
import AddPaymentModal from "../../components/AddPaymentModal.jsx";
import {Plus} from "lucide-react";
import {useTranslations} from "../../contexts/LanguageContext.jsx";

const AccountPayments = () => {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const t = useTranslations();

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            setIsLoading(true);
            const data = await paymentService.getUserPayments();
            setPayments(data);
        } catch (error) {
            console.error('Failed to load payments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (payment) => {
        setSelectedPayment(payment);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (formData) => {
        try {
            await paymentService.editUserPayment(selectedPayment.id, {
                paymentMethod: selectedPayment.paymentMethod,
                lastDigits: formData.lastDigits ? formData.lastDigits.slice(-4) : null,
                expirationDate: formData.expirationDate ? formData.expirationDate + "-01" : null,
                email: formData.email ? formData.email : null,
            });
            await loadPayments();
        } catch (error) {
            throw error;
        }
    };

    const handleDelete = async () => {
        try {
            await paymentService.deleteUserPayment(selectedPayment.id);
            await loadPayments();
        } catch (error) {
            throw error;
        }
    };

    const handleAddPayment = async (paymentData) => {
        try {
            await paymentService.addPayment({
                paymentMethod: paymentData.paymentMethod,
                lastDigits: paymentData.lastDigits ? paymentData.lastDigits.slice(-4) : paymentData.lastDigits,
                expirationDate: paymentData.expirationDate ? paymentData.expirationDate+"-01" : paymentData.expirationDate,
                email: paymentData.email
            });
            await loadPayments();
        } catch (error) {
            throw error;
        }
    };

    const getEditFields = (payment) => {
        if (payment.paymentMethod === 'CREDIT_CARD') {
            return [
                {
                    name: 'lastDigits',
                    label: t.creditCardNumber,
                    type: 'text',
                    placeholder: '43537457455'
                },
                {
                    name: 'expirationDate',
                    label: t.expirationDate,
                    type: 'month',
                    placeholder: ''
                }
            ];
        } else {
            return [
                {
                    name: 'email',
                    label: t.email,
                    type: 'email',
                    placeholder: 'your@email.com'
                }
            ];
        }
    };

    const formatPaymentMethod = (method) => {
        const methods = {
            'CREDIT_CARD': t.creditCard,
            'PAYPAL': t.paypal
        };
        return methods[method] || method;
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-5xl p-5 font-sans">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-600">{t.loadingPayments}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-5">
            <div className="mb-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.paymentMethods}</h3>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.paymentMethod}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.identification}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.expiresAt}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.action}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center">
                                        {payment.paymentMethod === 'CREDIT_CARD' ? (
                                            <>
                                                <img
                                                    className="select-none h-6 mr-2"
                                                    src="/src/assets/payments/mastercard.png" alt="Mastercard"/>
                                                {formatPaymentMethod(payment.paymentMethod)}
                                            </>
                                        ) : (
                                            <>
                                                <img
                                                    className="select-none h-6 mr-2"
                                                    src="/src/assets/payments/paypal.png" alt="PayPal"/>
                                                {formatPaymentMethod(payment.paymentMethod)}
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {payment.paymentMethod === 'CREDIT_CARD'
                                        ? `${t.cardNumberEnded} ${payment.lastDigits}`
                                        : payment.email
                                    }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {payment.expirationDate || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(payment)}
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

            <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white py-2 px-4 w-48 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all mx-auto mt-3 flex items-center justify-center gap-2 cursor-pointer"
            >
                <Plus className="w-4 h-4"/>
                {t.addPaymentMethod}
            </button>

            {selectedPayment && (
                <DynamicModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedPayment(null);
                    }}
                    title={selectedPayment.paymentMethod === 'CREDIT_CARD' ? t.editCreditCard : t.editPayPal}
                    fields={getEditFields(selectedPayment)}
                    initialData={{
                        email: selectedPayment.email
                    }}
                    onSave={handleSaveEdit}
                    onDelete={handleDelete}
                    showDelete={true}
                />
            )}

            <AddPaymentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddPayment}
            />
        </div>
    );
};

export default AccountPayments;