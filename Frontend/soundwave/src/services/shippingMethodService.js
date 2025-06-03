import { apiClient, handleApiError } from './apiService.js';

export const shippingMethodService = {
    async getShippingMethods(params = {}) {
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
            const response = await apiClient.get(`/api/shipping_method?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch shipping methods');
        }
    },

    async getAllShippingMethods() {
        try {
            const response = await apiClient.get('/api/shipping_method/all');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch shipping methods');
        }
    },

    async addShippingMethod(shippingMethodRequest) {
        try {
            const response = await apiClient.post('/api/shipping_method/add', shippingMethodRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to add shipping method');
        }
    },

    async editShippingMethod(id, shippingMethodRequest) {
        try {
            const response = await apiClient.put(`/api/shipping_method/${id}`, shippingMethodRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to edit shipping method');
        }
    },

    async deleteShippingMethod(id) {
        try {
            const response = await apiClient.delete(`/api/shipping_method/${id}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to delete shipping method');
        }
    }
};

export default shippingMethodService;