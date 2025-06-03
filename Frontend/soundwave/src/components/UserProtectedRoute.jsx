import React from "react";
import {useAuth} from "../contexts/AuthContext.jsx";
import {Link} from "react-router-dom";
import {useTranslations} from "../contexts/LanguageContext.jsx";

export const UserProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const t = useTranslations();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">{t.loading}</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">{t.authenticationRequired}</h2>
                    <p className="text-gray-600 mb-4">{t.pleaseLogInToAccess}</p>
                    <Link
                        to="/"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 hover:scale-105 transform"
                    >
                        {t.returnToHome}
                    </Link>
                </div>
            </div>
        );
    }

    return children;
};

export default UserProtectedRoute;