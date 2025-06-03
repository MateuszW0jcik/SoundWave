import React from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from "../contexts/AuthContext.jsx";
import {User, Package, DollarSign, Shield, LogOut} from 'lucide-react';
import {useTranslations} from "../contexts/LanguageContext.jsx";

const UserDropdown = ({isOpen, onClose, userInfo}) => {
    const {isAuthenticated, isAdmin, logout} = useAuth();
    const t = useTranslations();

    const handleLogout = async () => {
        try {
            await logout();
            onClose();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div
            className={`absolute right-0 top-full mt-2 bg-white min-w-52 rounded-lg shadow-lg transition-all duration-200 z-50 px-5 py-2.5 ${
                isOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2.5'
            }`}
        >
            {/* User Profile */}
            <div
                className="flex items-center rounded-lg cursor-pointer transition-colors duration-200">
                <User className="mr-3 w-5 h-5 text-gray-600 select-none"/>
                <Link
                    to="/account/personal data"
                    className="flex flex-col py-2 text-gray-800 no-underline hover:text-blue-600 transition-colors duration-200"
                    onClick={onClose}
                >
          <span className="font-medium">
            {userInfo?.firstName} {userInfo?.lastName}
          </span>
                    <span className="text-sm">
            {userInfo?.email}
          </span>
                </Link>
            </div>

            {/* Orders */}
            <div
                className="flex items-center rounded-lg cursor-pointer transition-colors duration-200">
                <Package className="mr-3 w-5 h-5 text-gray-600 select-none"/>
                <Link
                    to="/account/orders"
                    className="flex items-center py-2 text-gray-800 no-underline hover:text-blue-600 transition-colors duration-200"
                    onClick={onClose}
                >
                    {t.orders}
                </Link>
            </div>

            {/* Payments */}
            <div
                className="flex items-center rounded-lg cursor-pointer transition-colors duration-200">
                <DollarSign className="mr-3 w-5 h-5 text-gray-600 select-none"/>
                <Link
                    to="/account/payments"
                    className="flex items-center py-2 text-gray-800 no-underline hover:text-blue-600 transition-colors duration-200"
                    onClick={onClose}
                >
                    {t.payments}
                </Link>
            </div>

            {/* Admin Dashboard - Only show if user is admin */}
            {isAdmin && (
                <div
                    className="flex items-center rounded-lg cursor-pointer transition-colors duration-200">
                    <Shield className="mr-3 w-5 h-5 text-gray-600 select-none"/>
                    <Link
                        to="/dashboard"
                        className="flex items-center py-2 text-gray-800 no-underline hover:text-blue-600 transition-colors duration-200"
                        onClick={onClose}
                    >
                        {t.dashboard}
                    </Link>
                </div>
            )}

            {/* Logout */}
            <div
                className="flex items-center rounded-lg cursor-pointer transition-colors duration-200">
                <LogOut className="mr-3 w-5 h-5 text-red-600 select-none"/>
                <button
                    onClick={handleLogout}
                    className="flex items-center py-2 text-red-600 bg-transparent border-none cursor-pointer hover:text-red-600 hover:opacity-70 transition-opacity duration-200"
                >
                    {t.logOut}
                </button>
            </div>
        </div>
    );
};

export default UserDropdown;