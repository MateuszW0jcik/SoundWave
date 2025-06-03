import { apiClient, handleApiError } from './apiService.js';

export const contactService = {
    async getUserContacts() {
        try {
            const response = await apiClient.get('/api/contact');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch contacts');
        }
    },

    async addContact(contactRequest) {
        try {
            const response = await apiClient.post('/api/contact/add', contactRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to add contact');
        }
    },

    async editUserContact(id, contactRequest) {
        try {
            const response = await apiClient.put(`/api/contact/${id}`, contactRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to edit contact');
        }
    },

    async deleteUserContact(id) {
        try {
            const response = await apiClient.delete(`/api/contact/user/${id}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to delete contact');
        }
    }
};

export default contactService;