import {apiClient, handleApiError} from './apiService.js';

export const addressService = {
    async getUserAddresses() {
        try {
            const response = await apiClient.get('/api/address');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch addresses');
        }
    },

    async addAddress(addressRequest) {
        try {
            const response = await apiClient.post('/api/address/add', addressRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to add address');
        }
    },

    async editUserAddress(addressId, addressRequest) {
        try {
            const response = await apiClient.put(`/api/address/${addressId}`, addressRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to edit address');
        }
    },

    async deleteUserAddress(addressId) {
        try {
            const response = await apiClient.delete(`/api/address/user/${addressId}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to delete address');
        }
    }
};

export default addressService;