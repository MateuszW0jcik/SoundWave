import {apiClient, handleApiError} from './apiService.js';

export const productService = {

    async getProducts(params = {}) {
        const {
            page = 0,
            size = 10,
            sortBy = 'name',
            sortDir = 'asc',
            name = '',
            typeId,
            brandId,
            wireless,
            minPrice,
            maxPrice
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('size', size.toString());
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);

        if (name) queryParams.append('name', name);
        if (typeId !== undefined) queryParams.append('typeId', typeId.toString());
        if (brandId !== undefined) queryParams.append('brandId', brandId.toString());
        if (wireless !== undefined) queryParams.append('wireless', wireless.toString());
        if (minPrice !== undefined) queryParams.append('minPrice', minPrice.toString());
        if (maxPrice !== undefined) queryParams.append('maxPrice', maxPrice.toString());

        try {
            const response = await apiClient.get(`/api/product?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch products');
        }
    },

    async getProductById(productId) {
        try {
            const response = await apiClient.get(`/api/product/${productId}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch product');
        }
    },

    async getProductImage(productId) {
        try {
            const response = await apiClient.get(`/api/product/${productId}/image`,{
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch product image');
        }
    },

    async getNewProducts() {
        try {
            const response = await apiClient.get('/api/product/new');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch new products');
        }
    },

    async getBestSellersProducts() {
        try {
            const response = await apiClient.get('/api/product/best');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch bestsellers');
        }
    },

    async addProduct(productRequest) {
        try {
            return await apiClient.post('/api/product/add', productRequest, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch (error) {
            handleApiError(error, 'Failed to add product');
        }
    },

    async editProduct(id, productRequest) {
        try {
            return await apiClient.put(`/api/product/${id}`, productRequest, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch (error) {
            handleApiError(error, 'Failed to edit product');
        }
    },

    async deleteProduct(id) {
        try {
            return await apiClient.delete(`/api/product/${id}`);
        } catch (error) {
            handleApiError(error, 'Failed to delete product');
        }
    }
};

export default productService;