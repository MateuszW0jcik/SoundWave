import React, {useEffect, useState} from 'react';
import Header from "../../../components/Header.jsx";
import Footer from "../../../components/Footer.jsx";
import {useCart} from "../../../contexts/CartContext.jsx";
import CheckoutImage from "../../../assets/cart-path/checkout.png";
import {Link, useNavigate} from "react-router-dom";
import ProductInCheckout from "../../../components/ProductInCheckout.jsx";
import {Mail, MapPin, Plus, User, Truck} from "lucide-react";
import {useAuth} from "../../../contexts/AuthContext.jsx";
import blueEditIcon from "../../../assets/icons/blue-edit-icon.png";
import addressService from "../../../services/addressService.js";
import contactService from "../../../services/contactService.js";
import DynamicModal from "../../../components/DynamicModal.jsx";
import shippingMethodService from "../../../services/shippingMethodService.js";
import {useTranslations} from "../../../contexts/LanguageContext.jsx";

const Checkout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { cartItems, subTotal } = useCart();
    const { user } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [shippingMethods, setShippingMethods] = useState([]);
    const t = useTranslations();

    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [selectedShippingMethodId, setSelectedShippingMethodId] = useState(null);

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
            const [addressesData, contactsData, shippingData] = await Promise.all([
                addressService.getUserAddresses(),
                contactService.getUserContacts(),
                shippingMethodService.getAllShippingMethods(),
            ]);
            setAddresses(addressesData || []);
            setContacts(contactsData || []);
            setShippingMethods(shippingData || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            setSelectedAddressId(addresses[0].id);
        }
        if (contacts.length > 0 && !selectedContactId) {
            setSelectedContactId(contacts[0].id);
        }
        if (shippingMethods.length > 0 && !selectedShippingMethodId) {
            setSelectedShippingMethodId(shippingMethods[0].id);
        }
    }, [addresses, contacts, shippingMethods, selectedAddressId, selectedContactId, selectedShippingMethodId]);

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
            title: address ? t.editAddress : t.addAddressModalTitle,
            fields: [
                { name: 'street', label: t.street, type: 'text', placeholder: t.enterStreetName, required: true },
                { name: 'streetNumber', label: t.streetNumber, type: 'text', placeholder: t.enterStreetNumber, required: true },
                { name: 'postalCode', label: t.postalCode, type: 'text', placeholder: t.enterPostalCode, required: true },
                { name: 'city', label: t.city, type: 'text', placeholder: t.enterCity, required: true },
                { name: 'country', label: t.country, type: 'text', placeholder: t.enterCountry, required: true }
            ],
            initialData: address || {},
            editId: address?.id || null
        });
    };

    const openContactModal = (contact = null) => {
        setModal({
            isOpen: true,
            type: 'contact',
            title: contact ? t.editContact : t.addContactModalTitle,
            fields: [
                { name: 'email', label: t.email, type: 'email', placeholder: t.enterEmailAddress, required: true },
                { name: 'phoneNumber', label: t.phoneNumber, type: 'tel', placeholder: t.enterPhoneNumber, required: true }
            ],
            initialData: contact || {},
            editId: contact?.id || null
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

                case 'contact':
                    if (modal.editId) {
                        await contactService.editUserContact(modal.editId, formData);
                    } else {
                        await contactService.addContact(formData);
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
                        if (selectedAddressId === modal.editId) {
                            setSelectedAddressId(null);
                        }
                        await loadData();
                    }
                    break;

                case 'contact':
                    if (modal.editId) {
                        await contactService.deleteUserContact(modal.editId);
                        if (selectedContactId === modal.editId) {
                            setSelectedContactId(null);
                        }
                        await loadData();
                    }
                    break;
            }
        } catch (error) {
            throw error;
        }
    };

    const getShippingCost = () => {
        const method = shippingMethods.find(m => m.id === selectedShippingMethodId);
        return method ? method.price : 0;
    };

    const getGrandTotal = () => {
        return subTotal + getShippingCost();
    };

    const canProceedToPayment = () => {
        return selectedAddressId && selectedContactId && cartItems.length > 0 && selectedShippingMethodId;
    };

    const handleProceedToPayment = () => {
        const checkoutData = {
            shipping_address_id: selectedAddressId,
            contact_id: selectedContactId,
            shipping_method_id: selectedShippingMethodId,
            shipping_cost: getShippingCost(),
            subTotal: subTotal,
            grandTotal: getGrandTotal(),
            selected_address: addresses.find(addr => addr.id === selectedAddressId),
            selected_contact: contacts.find(contact => contact.id === selectedContactId),
            selected_shipping_method: shippingMethods.find(method => method.id === selectedShippingMethodId)
        };

        navigate('/cart/checkout/payment', {
            state: checkoutData
        });
    };

    if(loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="ml-4 text-lg">{t.loading}</div>
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
                            src={CheckoutImage}
                            alt="Cart path"
                            className="select-none mx-auto"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-5 relative">
                        <div className="lg:col-span-2 rounded-2xl p-6 box-border border border-gray-200 space-y-8 h-fit">
                            <div>
                                <h3 className="text-xl font-semibold mb-4">{t.fullName}</h3>
                                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                                    <User className="w-6 h-6 mr-3 text-gray-400"/>
                                    <p className="text-gray-800 flex-grow">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">{t.shippingAddress}</h3>
                                <div className="space-y-3">
                                    {addresses.map((address) => (
                                        <label key={address.id} className="cursor-pointer">
                                            <div className={`flex items-center p-4 rounded-lg border-2 transition-all mb-4 ${
                                                selectedAddressId === address.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="shipping_address"
                                                    value={address.id}
                                                    checked={selectedAddressId === address.id}
                                                    onChange={() => setSelectedAddressId(address.id)}
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

                            <div>
                                <h3 className="text-xl font-semibold mb-4">{t.contact}</h3>
                                <div className="space-y-3">
                                    {contacts.map((contact) => (
                                        <label key={contact.id} className="cursor-pointer">
                                            <div className={`flex items-center p-4 rounded-lg border-2 transition-all mb-4 ${
                                                selectedContactId === contact.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="contact"
                                                    value={contact.id}
                                                    checked={selectedContactId === contact.id}
                                                    onChange={() => setSelectedContactId(contact.id)}
                                                    className="mr-3 w-4 h-4 text-blue-600"
                                                />
                                                <Mail className="w-5 h-5 mr-3 text-gray-400"/>
                                                <p className="text-gray-800 text-sm flex-grow">
                                                    {contact.email}, {contact.phoneNumber}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        openContactModal(contact);
                                                    }}
                                                    className="cursor-pointer p-1 hover:scale-110 transition-transform text-blue-600 hover:text-blue-800"
                                                >
                                                    <img className="w-5 h-5" src={blueEditIcon} alt={t.edit}/>
                                                </button>
                                            </div>
                                        </label>
                                    ))}
                                    <button
                                        onClick={() => openContactModal()}
                                        className="bg-blue-600 text-white py-2 px-4 w-48 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all mx-auto mt-3 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4"/>
                                        {t.addContact}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">{t.shippingMethod}</h3>
                                <div className="space-y-3">
                                    {shippingMethods.map((method) => (
                                        <label key={method.id} className="cursor-pointer">
                                            <div className={`flex items-center p-4 rounded-lg border-2 transition-all mb-4 ${
                                                selectedShippingMethodId === method.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="shipping_method"
                                                    value={method.id}
                                                    checked={selectedShippingMethodId === method.id}
                                                    onChange={() => setSelectedShippingMethodId(method.id)}
                                                    className="mr-3 w-4 h-4 text-blue-600"
                                                />
                                                <Truck className="w-5 h-5 mr-3 text-gray-400"/>
                                                <div className="flex-grow">
                                                    <p className="text-gray-800 font-medium">{method.name}</p>
                                                    <p className="text-gray-600 text-sm">
                                                        {method.description}
                                                        <span className="font-semibold ml-2">
                                                            ${method.price.toFixed(2)}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link
                                    to="/cart"
                                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                                >
                                    {t.returnToCart}
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
                                    <span>${subTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>{t.shipping}</span>
                                    <span>${getShippingCost().toFixed(2)}</span>
                                </div>
                                <hr className="my-4 border-gray-200"/>
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>{t.grandTotal}</span>
                                    <span>${getGrandTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                {canProceedToPayment() ? (
                                    <button
                                        onClick={handleProceedToPayment}
                                        className="block w-full bg-blue-600 text-white border-none rounded-lg px-6 py-3 text-base font-bold cursor-pointer transition-transform hover:scale-105 text-center"
                                    >
                                        {t.proceedToPayment}
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="block w-full bg-gray-400 text-white border-none rounded-lg px-6 py-3 text-base font-bold cursor-not-allowed text-center"
                                        title={t.selectAddressAndContact}
                                    >
                                        {t.proceedToPayment}
                                    </button>
                                )}
                            </div>

                            {!canProceedToPayment() && (
                                <p className="text-red-500 text-sm text-center mt-2">
                                    {t.selectAddressAndContact}
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

export default Checkout;