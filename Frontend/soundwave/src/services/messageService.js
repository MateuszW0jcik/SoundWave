import { apiClient, handleApiError } from './apiService.js';

export const messageService = {
    async getMessages(params = {}) {
        const {
            page = 0,
            size = 10,
            sortBy = 'sentAt',
            sortDir = 'asc'
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('size', size.toString());
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);

        try {
            const response = await apiClient.get(`/api/message?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch messages');
        }
    },

    async createMessage(messageRequest) {
        try {
            const response = await apiClient.post('/api/message/create', messageRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to create message');
        }
    },

    async deleteMessage(id) {
        try {
            const response = await apiClient.delete(`/api/message/${id}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to delete message');
        }
    }
};

export default messageService;