import React, {useEffect, useState} from "react";
import { X } from 'lucide-react';
import {useTranslations} from "../contexts/LanguageContext.jsx";

const AddPaymentModal = ({ isOpen, onClose, onAdd }) => {
    const t = useTranslations();
    const [activeTab, setActiveTab] = useState('creditcard');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [formData, setFormData] = useState({
        cardNumber: '',
        expirationDate: '',
        email: ''
    });
    const [clickedOnOverlay, setClickedOnOverlay] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                cardNumber: '',
                expirationDate: '',
                email: ''
            });
            setErrorMessage('');
            setValidationErrors({});
            setActiveTab('creditcard');
        }
    }, [isOpen]);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setValidationErrors(prev => ({
            ...prev,
            [name]: undefined
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (activeTab === 'creditcard') {
            if (!formData.cardNumber.trim()) {
                errors.lastDigits = 'Card number is required';
            } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
                errors.lastDigits = 'Please enter a valid card number';
            }

            if (!formData.expirationDate) {
                errors.expirationDate = 'Expiration date is required';
            } else {
                const today = new Date();
                const selectedDate = new Date(formData.expirationDate + '-01');
                if (selectedDate < today) {
                    errors.expirationDate = 'Expiration date cannot be in the past';
                }
            }
        } else if (activeTab === 'paypal') {
            if (!formData.email.trim()) {
                errors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                errors.email = 'Please enter a valid email address';
            }
        }

        return errors;
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setErrorMessage('');
        setValidationErrors({});

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setIsLoading(false);
            return;
        }

        try {
            const paymentData = {
                paymentMethod: activeTab === 'creditcard' ? 'CREDIT_CARD' : 'PAYPAL',
                ...(activeTab === 'creditcard'
                        ? {
                            lastDigits: formData.cardNumber.replace(/\s/g, '').slice(-4),
                            expirationDate: formData.expirationDate
                        }
                        : { email: formData.email }
                )
            };

            await onAdd(paymentData);
            onClose();
        } catch (error) {
            console.log(error);
            if (error.type === 'VALIDATION_ERROR') {
                setValidationErrors(error.errors);
            } else {
                setErrorMessage(error.message || 'Failed to add payment method.');
            }
        } finally {
            setIsLoading(false);
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

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold text-gray-800">{t.addPaymentMethod}</h2>
                    <button
                        onClick={onClose}
                        className="bg-none border-none cursor-pointer p-1"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5 text-gray-400"/>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-5">
                    <button
                        className={`flex-1 p-4 text-center border-none bg-none cursor-pointer text-base relative ${
                            activeTab === 'creditcard'
                                ? 'text-blue-600'
                                : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab('creditcard')}
                    >
                        {t.creditCard}
                        {activeTab === 'creditcard' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                        )}
                    </button>
                    <button
                        className={`flex-1 p-4 text-center border-none bg-none cursor-pointer text-base relative ${
                            activeTab === 'paypal'
                                ? 'text-blue-600'
                                : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab('paypal')}
                    >
                        {t.paypal}
                        {activeTab === 'paypal' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                        )}
                    </button>
                </div>

                <div className="animate-fade-in">
                    {activeTab === 'creditcard' && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium text-gray-600">
                                    {t.creditCardNumber}
                                </label>
                                <input
                                    type="text"
                                    value={formData.cardNumber}
                                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                    className={`w-full px-4 py-3 border ${
                                        validationErrors.lastDigits ? 'border-red-500' : 'border-gray-200'
                                    } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder={t.placeholderCard}
                                />
                                {validationErrors.lastDigits && (
                                    <p className="text-xs text-red-500 mt-1">{validationErrors.lastDigits}</p>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium text-gray-600">
                                    {t.expirationDate}
                                </label>
                                <input
                                    type="month"
                                    value={formData.expirationDate}
                                    onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                                    className={`w-full px-4 py-3 border ${
                                        validationErrors.expirationDate ? 'border-red-500' : 'border-gray-200'
                                    } rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-800`}
                                />
                                {validationErrors.expirationDate && (
                                    <p className="text-xs text-red-500 mt-1">{validationErrors.expirationDate}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'paypal' && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium text-gray-600">
                                    {t.email}
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full px-4 py-3 border ${
                                        validationErrors.email ? 'border-red-500' : 'border-gray-200'
                                    } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder={t.placeholderEmail}
                                />
                                {validationErrors.email && (
                                    <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Global error message */}
                    {errorMessage && (
                        <div className="mb-4 text-sm border border-red-300 text-red-700 bg-red-100 p-2 rounded">
                            {t.genericError}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isLoading ? t.saving : t.save}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPaymentModal;