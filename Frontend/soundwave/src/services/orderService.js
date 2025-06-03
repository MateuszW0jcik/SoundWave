import { apiClient, handleApiError } from './apiService.js';

export const orderService = {
    async getUserOrders(params = {}) {
        const {
            page = 0,
            size = 10,
            sortBy = 'id',
            sortDir = 'asc'
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('size', size.toString());
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);

        try {
            const response = await apiClient.get(`/api/order?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch user orders');
        }
    },

    async getAllOrders(params = {}) {
        const {
            page = 0,
            size = 10,
            sortBy = 'id',
            sortDir = 'asc',
            ownerName = ''
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('size', size.toString());
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);
        queryParams.append('ownerName', ownerName);

        try {
            const response = await apiClient.get(`/api/order/all?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch user orders');
        }
    },

    async getOrderDetails(orderId) {
        try {
            const response = await apiClient.get(`/api/order/${orderId}/admin/details`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch order details');
        }
    },

    async getUserOrderDetails(orderId) {
        try {
            const response = await apiClient.get(`/api/order/${orderId}/details`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch order details');
        }
    },

    async createOrder(orderRequest) {
        try {
            const response = await apiClient.post('/api/order/create', orderRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to create order');
        }
    }
};

export default orderService;