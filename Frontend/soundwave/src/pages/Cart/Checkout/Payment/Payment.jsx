import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import Header from "../../../../components/Header.jsx";
import PaymentImage from "../../../../assets/cart-path/payment.png";
import {MapPin, Plus} from "lucide-react";
import blueEditIcon from "../../../../assets/icons/blue-edit-icon.png";
import ProductInCheckout from "../../../../components/ProductInCheckout.jsx";
import DynamicModal from "../../../../components/DynamicModal.jsx";
import Footer from "../../../../components/Footer.jsx";
import {useCart} from "../../../../contexts/CartContext.jsx";
import addressService from "../../../../services/addressService.js";
import paymentService from "../../../../services/paymentService.js";
import AddPaymentModal from "../../../../components/AddPaymentModal.jsx";
import orderService from "../../../../services/orderService.js";
import {toast} from "react-toastify";
import {useTranslations} from "../../../../contexts/LanguageContext.jsx";

const Payment = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const checkoutData = location.state;
    const {cartItems, loadUserShoppingCartItems} = useCart();
    const [payments, setPayments] = useState([]);
    const [billingAddresses, setBillingAddresses] = useState([]);
    const t = useTranslations();

    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [selectedBillingAddressId, setSelectedBillingAddressId] = useState(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        if (!checkoutData || !checkoutData.shipping_address_id || !checkoutData.contact_id || !checkoutData.shipping_method_id) {
            navigate('/cart/checkout', {replace: true});
        }
    }, [checkoutData, navigate]);

    if (!checkoutData) {
        return null;
    }

    const [modal, setModal] = useState({
        isOpen: false,
        type: '',
        title: '',
        fields: [],
        initialData: {},
        editId: null
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [addressesData, paymentsData] = await Promise.all([
                addressService.getUserAddresses(),
                paymentService.getUserPayments(),
            ]);
            setBillingAddresses(addressesData || []);
            setPayments(paymentsData || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (billingAddresses.length > 0 && !selectedBillingAddressId) {
            setSelectedBillingAddressId(billingAddresses[0].id);
        }
        if (payments.length > 0 && !selectedPaymentId) {
            setSelectedPaymentId(payments[0].id);
        }
    }, [billingAddresses, payments, selectedBillingAddressId, selectedPaymentId]);

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

    const openAddressModal = (address = null) => {
        setModal({
            isOpen: true,
            type: 'address',
            title: address ? t.editAddress : t.addAddress,
            fields: [
                {name: 'street', label: t.street, type: 'text', placeholder: t.enterStreetName, required: true},
                {
                    name: 'streetNumber',
                    label: t.streetNumber,
                    type: 'text',
                    placeholder: t.enterStreetNumber,
                    required: true
                },
                {
                    name: 'postalCode',
                    label: t.postalCode,
                    type: 'text',
                    placeholder: t.enterPostalCode,
                    required: true
                },
                {name: 'city', label: t.city, type: 'text', placeholder: t.enterCity, required: true},
                {name: 'country', label: t.country, type: 'text', placeholder: t.enterCountry, required: true}
            ],
            initialData: address || {},
            editId: address?.id || null
        });
    };

    const handleSave = async (formData) => {
        try {
            switch (modal.type) {
                case 'address':
                    if (modal.editId) {
                        await addressService.editUserAddress(modal.editId, formData);
                    } else {
                        await addressService.addAddress(formData);
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
                case 'address':
                    if (modal.editId) {
                        await addressService.deleteUserAddress(modal.editId);
                        if (selectedBillingAddressId === modal.editId) {
                            setSelectedBillingAddressId(null);
                        }
                        await loadData();
                    }
                    break;

            }
        } catch (error) {
            throw error;
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
            await loadData();
        } catch (error) {
            throw error;
        }
    };

    const handleDeletePayment = async () => {
        try {
            await paymentService.deleteUserPayment(selectedPayment.id);
            await loadData();
        } catch (error) {
            throw error;
        }
    };

    const handleAddPayment = async (paymentData) => {
        try {
            await paymentService.addPayment({
                paymentMethod: paymentData.paymentMethod,
                lastDigits: paymentData.lastDigits ? paymentData.lastDigits.slice(-4) : paymentData.lastDigits,
                expirationDate: paymentData.expirationDate ? paymentData.expirationDate + "-01" : paymentData.expirationDate,
                email: paymentData.email
            });
            await loadData();
        } catch (error) {
            throw error;
        }
    };

    const getEditFields = (payment) => {
        if (payment.paymentMethod === 'CREDIT_CARD') {
            return [
                {
                    name: 'lastDigits',
                    label: t.creditCardNumber, // Assuming you have this translation key
                    type: 'text',
                    placeholder: '43537457455'
                },
                {
                    name: 'expirationDate',
                    label: t.expirationDate, // Assuming you have this translation key
                    type: 'month',
                    placeholder: ''
                }
            ];
        } else {
            return [
                {
                    name: 'email',
                    label: t.email, // Assuming you have this translation key
                    type: 'email',
                    placeholder: 'your@email.com'
                }
            ];
        }
    };

    const formatPaymentMethod = (method) => {
        const methods = {
            'CREDIT_CARD': t.creditCard,
            'PAYPAL': t.payPal
        };
        return methods[method] || method;
    };

    const canFinalizePayment = () => {
        return selectedBillingAddressId && selectedPaymentId && cartItems.length > 0;
    };

    const handleFinalizePayment = async () => {
        setSelectedBillingAddressId(null);

        try {
            await orderService.createOrder({
                addressId: checkoutData.shipping_address_id,
                contactId: checkoutData.contact_id,
                paymentId: selectedPaymentId,
                shippingMethodId: checkoutData.shipping_method_id,
            })
            await loadUserShoppingCartItems();
            toast.success(t.orderCreated);
            navigate('/');
        } catch (error) {
            await loadUserShoppingCartItems();
            toast.error(t.errorCreatingOrder);
            navigate('/');
        }
    };

    if(loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <>
            <Header/>

            <div className="max-w-5xl mx-auto p-5 flex justify-center">
                <div className="w-full">
                    <div className="my-8 mb-12">
                        <img
                            src={PaymentImage}
                            alt="Cart path"
                            className="select-none mx-auto"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-5 relative">
                        <div
                            className="lg:col-span-2 rounded-2xl p-6 box-border border border-gray-200 space-y-8 h-fit">

                            <div>
                                <h3 className="text-xl font-semibold mb-4">{t.paymentMethods}</h3>
                                <div className="space-y-3">
                                    {payments.map((payment) => (
                                        <label key={payment.id} className="cursor-pointer">
                                            <div
                                                className={`flex items-center p-4 rounded-lg border-2 transition-all mb-4 ${
                                                    selectedPaymentId === payment.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value={payment.id}
                                                    checked={selectedPaymentId === payment.id}
                                                    onChange={() => setSelectedPaymentId(payment.id)}
                                                    className="mr-3 w-4 h-4 text-blue-600"
                                                />
                                                <div className="flex items-center flex-grow">
                                                    {payment.paymentMethod === 'CREDIT_CARD' ? (
                                                        <img
                                                            className="select-none h-6 mr-3"
                                                            src="/src/assets/payments/mastercard.png"
                                                            alt="Mastercard"
                                                        />
                                                    ) : (
                                                        <img
                                                            className="select-none h-6 mr-3"
                                                            src="/src/assets/payments/paypal.png"
                                                            alt="PayPal"
                                                        />
                                                    )}
                                                    <div className="flex-grow">
                                                        <p className="font-medium text-gray-800">
                                                            {formatPaymentMethod(payment.paymentMethod)}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {payment.paymentMethod === 'CREDIT_CARD'
                                                                ? `${t.cardEndingIn} ${payment.lastDigits}`
                                                                : payment.email
                                                            }
                                                        </p>
                                                        {payment.expirationDate && (
                                                            <p className="text-sm text-gray-500">
                                                                {t.expires}: {payment.expirationDate}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleEdit(payment);
                                                    }}
                                                    className="p-1 hover:scale-110 transition-transform text-blue-600 hover:text-blue-800 cursor-pointer"
                                                >
                                                    <img className="w-5 h-5" src={blueEditIcon} alt={t.edit}/>
                                                </button>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="bg-blue-600 text-white py-2 px-4 w-48 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all mx-auto mt-3 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Plus className="w-4 h-4"/>
                                    {t.addPaymentMethod}
                                </button>
                            </div>

                            {/* Edit Modal */}
                            {selectedPayment && (
                                <DynamicModal
                                    isOpen={isEditModalOpen}
                                    onClose={() => {
                                        setIsEditModalOpen(false);
                                        setSelectedPayment(null);
                                    }}
                                    title={`${t.edit} ${formatPaymentMethod(selectedPayment.paymentMethod)}`}
                                    fields={getEditFields(selectedPayment)}
                                    initialData={{
                                        email: selectedPayment.email
                                    }}
                                    onSave={handleSaveEdit}
                                    onDelete={handleDeletePayment}
                                    showDelete={true}
                                />
                            )}

                            {/* Add Payment Modal */}
                            <AddPaymentModal
                                isOpen={isAddModalOpen}
                                onClose={() => setIsAddModalOpen(false)}
                                onAdd={handleAddPayment}
                            />

                            {/* Billing Address Section */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">{t.billingAddress}</h3>
                                <div className="space-y-3">
                                    {billingAddresses.map((address) => (
                                        <label key={address.id} className="cursor-pointer">
                                            <div
                                                className={`flex items-center p-4 rounded-lg border-2 transition-all mb-4 ${
                                                    selectedBillingAddressId === address.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="billing_address"
                                                    value={address.id}
                                                    checked={selectedBillingAddressId === address.id}
                                                    onChange={() => setSelectedBillingAddressId(address.id)}
                                                    className="mr-3 w-4 h-4 text-blue-600"
                                                />
                                                <MapPin className="w-5 h-5 mr-3 text-gray-400"/>
                                                <p className="text-gray-800 text-sm flex-grow">
                                                    {address.street} {address.streetNumber}, {address.postalCode} {address.city}, {address.country}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        openAddressModal(address);
                                                    }}
                                                    className="p-1 hover:scale-110 transition-transform text-blue-600 hover:text-blue-800 cursor-pointer"
                                                >
                                                    <img className="w-5 h-5" src={blueEditIcon} alt={t.edit}/>
                                                </button>
                                            </div>
                                        </label>
                                    ))}
                                    <button
                                        onClick={() => openAddressModal()}
                                        className="bg-blue-600 text-white py-2 px-4 w-48 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all mx-auto mt-3 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4"/>
                                        {t.addAddress}
                                    </button>
                                </div>
                            </div>

                            {/* Return to Checkout Link */}
                            <div className="pt-4">
                                <Link
                                    to="/cart/checkout"
                                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                                >
                                    {t.returnToCheckout}
                                </Link>
                            </div>
                        </div>

                        <div
                            className="rounded-2xl p-4 pb-5 h-fit w-full min-w-[400px] box-border border border-gray-200">
                            <h3 className="text-2xl font-semibold mb-4">{t.yourOrder}</h3>

                            {cartItems.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">{t.noProductsInCart}</p>
                            ) : (
                                cartItems.map((item) => (
                                    <ProductInCheckout
                                        key={item.id}
                                        item={item}
                                        loading={loading}
                                    />
                                ))
                            )}

                            <div className="pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>{t.subtotal}</span>
                                    <span>${checkoutData.subTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>{t.shipping}</span>
                                    <span>${checkoutData.shipping_cost.toFixed(2)}</span>
                                </div>
                                <hr className="my-4 border-gray-200"/>
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>{t.grandTotal}</span>
                                    <span>${checkoutData.grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                {canFinalizePayment() ? (
                                    <button
                                        onClick={handleFinalizePayment}
                                        className="block w-full bg-blue-600 text-white border-none rounded-lg px-6 py-3 text-base font-bold cursor-pointer transition-transform hover:scale-105 text-center"
                                    >
                                        {t.orderItems}
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="block w-full bg-gray-400 text-white border-none rounded-lg px-6 py-3 text-base font-bold cursor-not-allowed text-center"
                                        title={t.selectPaymentAndBilling}
                                    >
                                        {t.orderItems}
                                    </button>
                                )}
                            </div>

                            {!canFinalizePayment() && (
                                <p className="text-red-500 text-sm text-center mt-2">
                                    {t.selectPaymentAndBilling}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DynamicModal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                fields={modal.fields}
                initialData={modal.initialData}
                onSave={handleSave}
                onDelete={handleDelete}
                showDelete={modal.editId !== null && (modal.type === 'address' || modal.type === 'contact')}
            />

            <Footer/>
        </>
    );
};

export default Payment;