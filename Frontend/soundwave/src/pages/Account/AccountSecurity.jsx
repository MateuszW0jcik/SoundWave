import React, {useState} from 'react';
import {Key, Mail} from 'lucide-react';
import blueEditIcon from '../../assets/icons/blue-edit-icon.png'
import DynamicModal from "../../components/DynamicModal.jsx";
import {useAuth} from "../../contexts/AuthContext.jsx";
import userService from "../../services/userService.js";
import {useTranslations} from "../../contexts/LanguageContext.jsx";


const AccountSecurity = () => {
    const {user, refreshUser} = useAuth();
    const [modal, setModal] = useState({
        isOpen: false,
        type: '',
        title: '',
        fields: [],
        initialData: {}
    });
    const t = useTranslations();

    const closeModal = () => {
        setModal({
            isOpen: false,
            type: '',
            title: '',
            fields: [],
            initialData: {}
        });
    };

    const openPasswordModal = () => {
        setModal({
            isOpen: true,
            type: 'password',
            title: t.changePasswordModalTitle,
            fields: [
                {
                    name: 'currentPassword',
                    label: t.currentPassword,
                    type: 'password',
                    placeholder: t.enterCurrentPassword,
                    required: true
                },
                {
                    name: 'newPassword',
                    label: t.newPassword,
                    type: 'password',
                    placeholder: t.enterNewPassword,
                    required: true
                },
                {
                    name: 'confirmPassword',
                    label: t.confirmNewPassword,
                    type: 'password',
                    placeholder: t.confirmNewPasswordPlaceholder,
                    required: true
                }
            ],
            initialData: {}
        });
    };

    const openEmailModal = () => {
        setModal({
            isOpen: true,
            type: 'email',
            title: t.changeLoginEmailModalTitle,
            fields: [
                {
                    name: 'currentPassword',
                    label: t.currentPassword,
                    type: 'password',
                    placeholder: t.enterCurrentPasswordVerification,
                    required: true
                },
                {
                    name: 'newEmail',
                    label: t.newEmailAddress,
                    type: 'email',
                    placeholder: t.enterNewEmailAddress,
                    required: true
                },
                {
                    name: 'confirmEmail',
                    label: t.confirmNewEmail,
                    type: 'email',
                    placeholder: t.confirmNewEmailPlaceholder,
                    required: true
                }
            ],
            initialData: {}
        });
    };

    const handleSave = async (formData) => {
        try {
            switch (modal.type) {
                case 'password':
                    await userService.changeUserPassword({
                        currentPassword: formData.currentPassword,
                        newPassword: formData.newPassword
                    });
                    alert(t.passwordChangedSuccess);
                    break;

                case 'email':
                    await userService.changeUserLoginEmail({
                        currentPassword: formData.currentPassword,
                        newEmail: formData.newEmail
                    });

                    refreshUser();

                    alert(t.loginEmailChangedSuccess);
                    break;
            }
        } catch (error) {
            alert(error.message || t.anErrorOccurred);
            throw error;
        }
    };

    return (
        <div className="w-full max-w-6xl p-5 font-sans">
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.securitySettings}</h3>
                <p className="text-sm text-gray-600">{t.changePasswordAndEmail}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col mb-6 max-w-md">
                    <div className="text-sm text-gray-600 mb-2">{t.password}</div>
                    <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                        <Key className="w-6 h-6 mr-3 text-gray-400"/>
                        <p className="text-gray-800 text-sm flex-grow">*************</p>
                        <button
                            onClick={openPasswordModal}
                            className="p-1 hover:scale-110 transition-transform text-blue-600 hover:text-blue-800"
                            aria-label={t.edit}
                        >
                            <img className="w-6 h-6 cursor-pointer" src={blueEditIcon} alt={t.edit}/>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {t.passwordStrengthTip}
                    </p>
                </div>

                <div className="flex flex-col mb-6 max-w-md">
                    <div className="text-sm text-gray-600 mb-2">{t.loginEmail}</div>
                    <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                        <Mail className="w-6 h-6 mr-3 text-gray-400"/>
                        <p className="text-gray-800 text-sm flex-grow truncate">
                            {user?.email || t.noEmailSet}
                        </p>
                        <button
                            onClick={openEmailModal}
                            className="p-1 hover:scale-110 transition-transform text-blue-600 hover:text-blue-800"
                            aria-label={t.edit}
                        >
                            <img className="w-6 h-6 cursor-pointer" src={blueEditIcon} alt={t.edit}/>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {t.loginEmailTip}
                    </p>
                </div>
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-lg font-medium text-blue-900 mb-3">{t.securityTips}</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {t.tip1}
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {t.tip2}
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {t.tip3}
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {t.tip4}
                    </li>
                </ul>
            </div>

            <DynamicModal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                fields={modal.fields}
                initialData={modal.initialData}
                onSave={handleSave}
                showDelete={false}
            />
        </div>
    );
};

export default AccountSecurity;