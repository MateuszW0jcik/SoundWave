import { apiClient, handleApiError } from './apiService.js';

export const brandService = {
    async getBrands(params = {}) {
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
            const response = await apiClient.get(`/api/brand?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch brands');
        }
    },

    async getAllBrand() {
        try {
            const response = await apiClient.get('/api/brand/all');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch brands');
        }
    },

    async addBrand(brandRequest) {
        try {
            const response = await apiClient.post('/api/brand/add', brandRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to add brand');
        }
    },

    async editBrand(id, brandRequest) {
        try {
            const response = await apiClient.put(`/api/brand/${id}`, brandRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to edit brand');
        }
    },

    async deleteBrand(id) {
        try {
            const response = await apiClient.delete(`/api/brand/${id}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to delete brand');
        }
    }
};

export default brandService;
