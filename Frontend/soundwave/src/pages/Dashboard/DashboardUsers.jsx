import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {Search} from "lucide-react";
import Pagination from "../../components/Pagination.jsx";
import userService from "../../services/userService.js";
import {useTranslations} from "../../contexts/LanguageContext.jsx"; // Adjust the path as needed

const DashboardUsers = () => {
    const searchInputRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [updatingUsers, setUpdatingUsers] = useState(new Set());
    const currentPage = parseInt(searchParams.get('page') || '1');
    const t = useTranslations(); // Initialize useTranslations hook

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        if (!loading && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [loading]);

    useEffect(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const response = await userService.getUsers({
                        page: currentPage - 1,
                        size: 10,
                        sortBy: 'createdAt',
                        sortDir: 'desc',
                        name: debouncedSearchTerm
                    });
                    setUsers(response.content);
                    setTotalPages(response.totalPages);
                } catch (error) {
                    console.error('Failed to fetch users:', error);
                } finally {
                    setLoading(false);
                }

            };

            loadData();
        }, [debouncedSearchTerm, searchParams]
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

    const handleStatusChange = async (userId, field, newValue) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        setUpdatingUsers(prev => new Set(prev).add(userId));

        try {
            const request = {
                userId: userId,
                admin: field === 'admin' ? newValue : user.admin,
                active: field === 'active' ? newValue : user.active
            };

            await userService.changeUserStatus(request);

            setUsers(prevUsers =>
                prevUsers.map(u =>
                    u.id === userId
                        ? { ...u, [field]: newValue }
                        : u
                )
            );
        } catch (error) {
            console.error(`Failed to update user ${field} status:`, error);
        } finally {
            setUpdatingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="ml-4 text-lg">{t.loading}</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-5">
            <div className="flex items-center w-full border border-gray-300 rounded px-3 py-2 bg-white mb-4">
                <Search
                    alt={t.search} // Assuming 'search' is a translation key for alt text
                    className="w-5 h-5 mr-2 select-none"
                />
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.searchByNameOrEmail}
                    autoComplete="off"
                    className="flex-1 outline-none bg-transparent text-sm"
                />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.userId}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.name}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.email}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.admin}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.active}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t.createdAt}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    #{user.id}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 break-words">
                                    {user.firstName + ' ' + user.lastName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 break-words">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={user.admin}
                                            onChange={(e) => handleStatusChange(user.id, 'admin', e.target.checked)}
                                            disabled={updatingUsers.has(user.id)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                                        />
                                        {updatingUsers.has(user.id) && (
                                            <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={user.active}
                                            onChange={(e) => handleStatusChange(user.id, 'active', e.target.checked)}
                                            disabled={updatingUsers.has(user.id)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                                        />
                                        {updatingUsers.has(user.id) && (
                                            <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDate(user.createdAt)}
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
    );
};

export default DashboardUsers;