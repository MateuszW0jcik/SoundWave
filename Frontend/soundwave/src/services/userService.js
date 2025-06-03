import { apiClient, handleApiError } from './apiService.js';

export const userService = {
    async getUsers(params = {}) {
        const {
            page = 0,
            size = 10,
            sortBy = 'name',
            sortDir = 'asc',
            name = ''
        } = params;

        try {
            const response = await apiClient.get('/api/user', {
                params: { page, size, sortBy, sortDir, name }
            });
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch users');
        }
    },

    async getMe() {
        try {
            const response = await apiClient.get('/api/user/me');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch user information');
        }
    },

    async changeUserStatus(request) {
        try {
            await apiClient.put('/api/user/status', request);
        } catch (error) {
            handleApiError(error, 'Failed to change user status');
        }
    },

    async editUserFullName(request) {
        try {
            const response = await apiClient.put('/api/user/name', request);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to edit full name');
        }
    },

    async changeUserPassword(request) {
        try {
            await apiClient.put('/api/user/password', request);
        } catch (error) {
            handleApiError(error, 'Failed to change password');
        }
    },

    async changeUserLoginEmail(request) {
        try {
            const response = await apiClient.put('/api/user/login_email', request);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to change login email');
        }
    }
};

export default userService;