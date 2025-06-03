import React, {useEffect, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import messageService from "../../services/messageService.js";
import Pagination from "../../components/Pagination.jsx";
import {toast} from "react-toastify";
import {useTranslations} from "../../contexts/LanguageContext.jsx";

const DashboardMessages = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const t = useTranslations();

    const currentPage = parseInt(searchParams.get('page') || '1');

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await messageService.getMessages({
                page: currentPage - 1,
                size: 10,
                sortBy: 'sentAt',
                sortDir: 'asc'
            });
            setMessages(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
            loadData();
        }, [searchParams]
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', newPage);
        setSearchParams(newParams);
        window.scrollTo(0, 0);
    };

    const handleDeleteMessage = async (messageId) => {
        setDeleting(true);
        try {
            await messageService.deleteMessage(messageId);
            await loadData();
        } catch (error) {
            toast.error(t.errorDeletingMessage, error);
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="ml-4 text-lg">{t.loading}</div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-6xl mx-auto px-5">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t.messageId}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t.message}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t.sender}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t.sentAt}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t.action}
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {messages.map((message) => (
                                <tr key={message.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{message.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {message.content}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 break-words">
                                        {message.name + '\n(' + message.email + ')'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(message.sentAt)}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <button
                                            onClick={() => handleDeleteMessage(message.id)}
                                            disabled={deleting}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {deleting ? t.deleting : t.delete}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mt-6"
                />
            </div>
        </>
    );
};

export default DashboardMessages;