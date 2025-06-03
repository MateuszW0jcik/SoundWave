import React, { useState, useEffect } from 'react';
import { User, Key, MapPin, Mail, Plus } from 'lucide-react';
import blueEditIcon from '../../assets/icons/blue-edit-icon.png'
import DynamicModal from '../../components/DynamicModal.jsx';
import {useAuth} from "../../contexts/AuthContext.jsx";
import userService from "../../services/userService.js";
import addressService from "../../services/addressService.js";
import contactService from "../../services/contactService.js";
import {useTranslations} from "../../contexts/LanguageContext.jsx";

const AccountPersonalData = () => {
    const { user, refreshUser } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState({
        isOpen: false,
        type: '',
        title: '',
        fields: [],
        initialData: {},
        editId: null
    });
    const t = useTranslations();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [addressesData, contactsData] = await Promise.all([
                addressService.getUserAddresses(),
                contactService.getUserContacts()
            ]);
            setAddresses(addressesData || []);
            setContacts(contactsData || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

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

    const openNameModal = () => {
        setModal({
            isOpen: true,
            type: 'name',
            title: t.editFullName,
            fields: [
                { name: 'firstName', label: t.firstName, type: 'text', placeholder: t.enterFirstName, required: true },
                { name: 'lastName', label: t.lastName, type: 'text', placeholder: t.enterLastName, required: true }
            ],
            initialData: { firstName: user?.firstName || '', lastName: user?.lastName || '' },
            editId: null
        });
    };

    const openPasswordModal = () => {
        setModal({
            isOpen: true,
            type: 'password',
            title: t.changePassword,
            fields: [
                { name: 'oldPassword', label: t.currentPassword, type: 'password', placeholder: t.enterCurrentPassword, required: true },
                { name: 'newPassword', label: t.newPassword, type: 'password', placeholder: t.enterNewPassword, required: true },
                { name: 'repeatedPassword', label: t.confirmNewPassword, type: 'password', placeholder: t.confirmNewPasswordPlaceholder, required: true }
            ],
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
                case 'name':
                    await userService.editUserFullName(formData);
                    await refreshUser();
                    break;

                case 'password':
                    if (formData.newPassword !== formData.repeatedPassword) {
                        alert(t.passwordsDoNotMatch);
                        return;
                    }
                    await userService.changeUserPassword(formData);
                    break;

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
                        await loadData();
                    }
                    break;

                case 'contact':
                    if (modal.editId) {
                        await contactService.deleteUserContact(modal.editId);
                        await loadData();
                    }
                    break;
            }
        } catch (error) {
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-6xl p-8 bg-white">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-16 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl p-5 font-sans">
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.identification}</h3>
                <p className="text-sm text-gray-600">{t.verifyIdentity}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col mb-6 max-w-md">
                    <div className="text-sm text-gray-600 mb-2">{t.fullName}</div>
                    <div className="flex items-center bg-gray-50 p-4 rounded-lg mb-3">
                        <User className="w-6 h-6 mr-3 text-gray-400"/>
                        <p className="text-gray-800 text-sm flex-grow truncate">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <button
                            onClick={openNameModal}
                            className="p-1 hover:scale-110 transition-transform text-blue-600 hover:text-blue-800"
                        >
                            <img className="w-6 h-6 cursor-pointer" src={blueEditIcon}  alt={t.edit}/>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col mb-6 max-w-md">
                    <div className="text-sm text-gray-600 mb-2">{t.password}</div>
                    <div className="flex items-center bg-gray-50 p-4 rounded-lg mb-3">
                        <Key className="w-6 h-6 mr-3 text-gray-400"/>
                        <p className="text-gray-800 text-sm flex-grow">*************</p>
                        <button
                            onClick={openPasswordModal}
                            className="p-1 hover:scale-110 transition-transform text-blue-600 hover:text-blue-800"
                        >
                            <img className="w-6 h-6 cursor-pointer" src={blueEditIcon} alt={t.edit}/>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col mb-6 max-w-md">
                    <div className="text-sm text-gray-600 mb-2">{t.addresses}</div>
                    {addresses.map((address) => (
                        <div key={address.id} className="flex items-center bg-gray-50 p-4 rounded-lg mb-3">
                            <MapPin className="w-6 h-6 mr-3 text-gray-400"/>
                            <p className="text-gray-800 text-sm flex-grow truncate">
                                {address.street} {address.streetNumber}, {address.postalCode} {address.city}, {address.country}
                            </p>
                            <button
                                onClick={() => openAddressModal(address)}
                                className="p-1 hover:scale-110 transition-transform text-blue-600 hover:text-blue-800"
                            >
                                <img className="w-6 h-6 cursor-pointer" src={blueEditIcon} alt={t.edit}/>
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => openAddressModal()}
                        className="bg-blue-600 text-white py-2 px-4 w-48 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all mx-auto mt-3 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        {t.addAddress}
                    </button>
                </div>

                <div className="flex flex-col mb-6 max-w-md">
                    <div className="text-sm text-gray-600 mb-2">{t.contacts}</div>
                    {contacts.map((contact) => (
                        <div key={contact.id} className="flex items-center bg-gray-50 p-4 rounded-lg mb-3">
                            <Mail className="w-6 h-6 mr-3 text-gray-400"/>
                            <p className="text-gray-800 text-sm flex-grow truncate">
                                {contact.email}, {contact.phoneNumber}
                            </p>
                            <button
                                onClick={() => openContactModal(contact)}
                                className="p-1 hover:scale-110 transition-transform text-blue-600 hover:text-blue-800"
                            >
                                <img className="w-6 h-6 cursor-pointer" src={blueEditIcon} alt={t.edit}/>
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => openContactModal()}
                        className="bg-blue-600 text-white py-2 px-4 w-48 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all mx-auto mt-3 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        {t.addContact}
                    </button>
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
        </div>
    );
};

export default AccountPersonalData;