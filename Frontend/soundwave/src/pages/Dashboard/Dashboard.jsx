import React from 'react';
import {Link, NavLink, Outlet} from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';
import {useTranslations} from "../../contexts/LanguageContext.jsx"; // Adjust the path as needed

const Dashboard = () => {
    const t = useTranslations();

    return (
        <>
            <div className="m-5 mb-0">
                <Link
                    to="/"
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4"/>
                    {t.backToShop}
                </Link>
            </div>
            <section className="max-w-7xl mx-auto px-4">

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
                    <div className="w-full lg:w-64 border border-gray-200 rounded-4xl">
                        <div className="py-6">
                            <div className="flex justify-center pb-4 mb-4 border-b-1 border-gray-200">
                                <h3 className="text-2xl font-semibold text-blue-500 overflow-hidden">
                                    {t.menu}
                                </h3>
                            </div>

                            <nav className="space-y-2">
                                <NavLink
                                    to="/dashboard/messages"
                                    className={({isActive}) =>
                                        `flex items-center p-3 pl-4 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    {t.messages}
                                </NavLink>

                                <NavLink
                                    to="/dashboard/orders"
                                    className={({isActive}) =>
                                        `flex items-center p-3 pl-4 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    {t.orders}
                                </NavLink>

                                <NavLink
                                    to="/dashboard/users"
                                    className={({isActive}) =>
                                        `flex items-center p-3 pl-4 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    {t.users}
                                </NavLink>

                                <NavLink
                                    to="/dashboard/products"
                                    className={({isActive}) =>
                                        `flex items-center p-3 pl-4 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    {t.products}
                                </NavLink>

                                <NavLink
                                    to="/dashboard/brands"
                                    className={({isActive}) =>
                                        `flex items-center p-3 pl-4 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    {t.brands}
                                </NavLink>

                                <NavLink
                                    to="/dashboard/types"
                                    className={({isActive}) =>
                                        `flex items-center p-3 pl-4 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    {t.types}
                                </NavLink>

                                <NavLink
                                    to="/dashboard/shipping methods"
                                    className={({isActive}) =>
                                        `flex items-center p-3 pl-4 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    {t.shippingMethods}
                                </NavLink>
                            </nav>
                        </div>
                    </div>

                    <div className="flex-1">
                        <Outlet/>
                    </div>
                </div>
            </section>

        </>
    );
};

export default Dashboard;