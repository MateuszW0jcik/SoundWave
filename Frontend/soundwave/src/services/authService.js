import {apiClient, handleApiError} from "./apiService.js";

export const authService = {
    async login(loginRequest) {
        try {
            const response = await apiClient.post('/api/auth/login', loginRequest);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Login failed');
        }
    },

    async loginViaGoogle(idToken) {
        try {
            const response = await apiClient.post('/api/auth/login/google', { idToken });
            return response.data;
        } catch (error) {
            handleApiError(error, 'Login failed');
        }
    },

    async register(registerRequest) {
        try {
            await apiClient.post('/api/auth/register', registerRequest);
            return true;
        } catch (error) {
            handleApiError(error, 'Registration failed');
        }
    },

    async refreshToken(refreshToken) {
        try {
            const response = await apiClient.post('/api/auth/token/refresh', {
                refreshToken,
            });
            return response.data;
        } catch (error) {
            handleApiError(error, 'Token refresh failed');
        }
    },

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('auth-logout'));
    },

    isLoggedIn() {
        return localStorage.getItem('accessToken') !== null;
    },

    getAccessToken() {
        return localStorage.getItem('accessToken');
    }
}

export default authService;