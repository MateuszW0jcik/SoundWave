import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import userService from "../services/userService.js";
import {toast} from "react-toastify";
import {useTranslations} from "./LanguageContext.jsx";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const t = useTranslations();

    useEffect(() => {
        const checkAuthStatus = async () => {
            setLoading(true);
            let accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            let refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

            if (accessToken && refreshToken) {
                try {
                    const userData = await userService.getMe();
                    setUser(userData);
                    setIsAuthenticated(true);
                    setIsAdmin(userData.roles.includes('ADMIN'));
                } catch (error) {
                    console.error('Failed to get user data or token invalid:', error);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('refreshToken');
                    setIsAuthenticated(false);
                    setIsAdmin(false);
                    setUser(null);
                }
            } else {
                setIsAuthenticated(false);
                setIsAdmin(false);
                setUser(null);
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = async (credentials, rememberMe = false) => {
        try {
            const response = await authService.login(credentials);

            if (rememberMe) {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
            } else {
                sessionStorage.setItem('accessToken', response.accessToken);
                sessionStorage.setItem('refreshToken', response.refreshToken);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }

            const userData = await userService.getMe();
            setUser(userData);
            setIsAuthenticated(true);
            setIsAdmin(userData.roles.includes('ADMIN'));

            toast.success(t.loginSuccessful);

            return response;
        } catch (error) {
            throw error;
        }
    };

    const loginViaGoogle = async (idToken) => {
        try {
            const response = await authService.loginViaGoogle(idToken);
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');

            const userData = await userService.getMe();
            setUser(userData);
            setIsAuthenticated(true);
            setIsAdmin(userData.roles.includes('ADMIN'));

            toast.success(t.loginSuccessful);

            return response;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            await authService.register(userData);

            toast.success(t.accountCreated);

            return true;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');

        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);

        toast.success(t.successfullyLoggedOut);
    };

    const refreshUser = async () => {
        try {
            const userData = await userService.getMe();
            setUser(userData);
            setIsAdmin(userData.roles.includes('ADMIN'));
            return userData;
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            logout();
            throw error;
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        loginViaGoogle,
        register,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const withAuth = (WrappedComponent) => {
    return function AuthenticatedComponent(props) {
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
                        <p className="text-gray-600">{t.pleaseLogInToAccess}</p>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
};
