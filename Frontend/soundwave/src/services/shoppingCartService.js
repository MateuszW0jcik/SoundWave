import { apiClient, handleApiError } from './apiService.js';

export const shoppingCartService = {
    async getUserShoppingCartItems() {
        try {
            const response = await apiClient.get('/api/shopping_cart');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch shopping cart items');
        }
    },

    async addUserShoppingCartItem(shoppingCartItemRequest) {
        try {
            const response = await apiClient.post('/api/shopping_cart/add', shoppingCartItemRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to add item to shopping cart');
        }
    },

    async deleteUserShoppingCartItem(id) {
        try {
            const response = await apiClient.delete(`/api/shopping_cart/user/${id}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to delete item from shopping cart');
        }
    },

    async updateUserShoppingCartItem(param) {
        try {
            await apiClient.put(`/api/shopping_cart/${param.id}`, param.newQuantity);
        } catch (error) {
            handleApiError(error, 'Failed to delete item from shopping cart');
        }
    }
};

export default shoppingCartService;