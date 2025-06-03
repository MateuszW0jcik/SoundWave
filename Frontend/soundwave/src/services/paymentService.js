import { apiClient, handleApiError } from './apiService.js';

export const paymentService = {
    async getUserPayments() {
        try {
            const response = await apiClient.get('/api/payment');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch payments');
        }
    },

    async addPayment(paymentRequest) {
        try {
            const response = await apiClient.post('/api/payment/add', paymentRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to add payment');
        }
    },

    async editUserPayment(id, paymentRequest) {
        try {
            const response = await apiClient.put(`/api/payment/${id}`, paymentRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to edit payment');
        }
    },

    async deleteUserPayment(id) {
        try {
            const response = await apiClient.delete(`/api/payment/user/${id}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to delete payment');
        }
    }
};

export default paymentService;