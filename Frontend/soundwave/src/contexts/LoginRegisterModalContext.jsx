import React, {createContext, useContext, useState, useEffect} from 'react';

const LoginRegisterModalContext = createContext();

export const LoginRegisterModalProvider = ({children}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const value = { isModalOpen, openModal, closeModal };

    return (
        <LoginRegisterModalContext.Provider value={value}>
            {children}
        </LoginRegisterModalContext.Provider>
    );
};

export const useLoginRegisterModal = () => {
    const context = useContext(LoginRegisterModalContext);
    if (!context) {
        throw new Error('useLoginRegisterModal must be used within a LoginRegisterModalContextProvider');
    }
    return context;
};