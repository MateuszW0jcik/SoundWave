import React, {useMemo} from 'react';
import {Link, NavLink, Outlet, useLocation} from 'react-router-dom';
import {User, Package, DollarSign, Key, Mail, Shield, LogOut} from 'lucide-react';
import {useAuth} from "../../contexts/AuthContext.jsx";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import {useTranslations} from "../../contexts/LanguageContext.jsx"; // Import useTranslations

const Account = () => {
    const {user, isAdmin, logout} = useAuth();
    const location = useLocation();
    const t = useTranslations(); // Initialize useTranslations hook

    const breadcrumbText = useMemo(() => {
        const path = location.pathname.toLowerCase();

        if (path.includes('personal%20data') || path.includes('personal data')) return t.personalData;
        if (path.includes('orders')) return t.orders;
        if (path.includes('payments')) return t.payments;
        if (path.includes('security')) return t.securityAccess;
        if (path.includes('contact')) return t.contactUs;
        return t.account;
    }, [location.pathname, t]); // Add 't' to the dependency array

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <Header/>

            <section className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm mb-5 mt-5 flex-wrap">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                        {t.home} &gt;
                    </Link>
                    <Link to="/account" className="text-gray-500 hover:text-gray-700 ml-1">
                        {t.account} &gt;
                    </Link>
                    <span className="text-blue-500 font-bold ml-1">{breadcrumbText}</span>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="w-full lg:w-72 mb-8 border border-gray-200 rounded-4xl">
                        <div className="p-6">
                            {/* User Info */}
                            <div className="flex items-center mb-8">
                                <div
                                    className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-gray-600"/>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-800 overflow-hidden">
                                        {user?.firstName} {user?.lastName}
                                    </h3>
                                </div>
                            </div>

                            {/* Navigation Menu */}
                            <nav className="space-y-2">
                                <NavLink
                                    to="/account/personal data"
                                    className={({isActive}) =>
                                        `flex items-center p-3 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    <User className="w-5 h-5 mr-3"/>
                                    {t.personalData}
                                </NavLink>

                                <NavLink
                                    to="/account/orders"
                                    className={({isActive}) =>
                                        `flex items-center p-3 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    <Package className="w-5 h-5 mr-3"/>
                                    {t.orders}
                                </NavLink>

                                <NavLink
                                    to="/account/payments"
                                    className={({isActive}) =>
                                        `flex items-center p-3 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    <DollarSign className="w-5 h-5 mr-3"/>
                                    {t.payments}
                                </NavLink>

                                <NavLink
                                    to="/account/security"
                                    className={({isActive}) =>
                                        `flex items-center p-3 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    <Key className="w-5 h-5 mr-3"/>
                                    {t.securityAccess}
                                </NavLink>

                                <NavLink
                                    to="/account/contact"
                                    className={({isActive}) =>
                                        `flex items-center p-3 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    <Mail className="w-5 h-5 mr-3"/>
                                    {t.contactUs}
                                </NavLink>

                                {isAdmin && (
                                    <NavLink
                                        to="/dashboard"
                                        className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <Shield className="w-5 h-5 mr-3"/>
                                        {t.dashboard}
                                    </NavLink>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
                                >
                                    <LogOut className="w-5 h-5 mr-3"/>
                                    {t.logOut}
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <Outlet/>
                    </div>
                </div>
            </section>

            <Footer/>
        </>
    );
};

export default Account;