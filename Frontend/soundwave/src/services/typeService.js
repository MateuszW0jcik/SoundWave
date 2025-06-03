import {apiClient, handleApiError} from './apiService.js';

export const typeService = {
    async getTypes(params = {}) {
        const {
            page = 0,
            size = 10,
            sortBy = 'id',
            sortDir = 'asc',
            name = ''
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('size', size.toString());
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);
        queryParams.append('name', name);

        try {
            const response = await apiClient.get(`/api/type?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch types');
        }
    },

    async getAllTypes() {
        try {
            const response = await apiClient.get('/api/type/all');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch types');
        }
    },

    async addType(typeRequest) {
        try {
            const response = await apiClient.post('/api/type/add', typeRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to add type');
        }
    },

    async editType(id, typeRequest) {
        try {
            const response = await apiClient.put(`/api/type/${id}`, typeRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to edit type');
        }
    },

    async deleteType(id) {
        try {
            const response = await apiClient.delete(`/api/type/${id}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to delete type');
        }
    }
};

export default typeService;