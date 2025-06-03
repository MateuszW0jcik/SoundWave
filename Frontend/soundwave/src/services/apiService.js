import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${import.meta.VITE_REACT_APP_API_URL}/api/auth/token/refresh`,
                        { refreshToken },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    const { accessToken, refreshToken: newRefreshToken } = response.data;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.dispatchEvent(new Event('auth-logout'));
                    return Promise.reject(refreshError);
                }
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.dispatchEvent(new Event('auth-logout'));
            }
        }

        return Promise.reject(error);
    }
);

export const handleApiError = (error, customMessage = 'Błąd API') => {
    console.error(`${customMessage}:`, error);

    if (error.response) {
        const { status, data } = error.response;

        if (status === 400 && typeof data === 'object' && !Array.isArray(data) && !data.message) {
            // To wygląda jak mapka błędów walidacyjnych
            throw {
                type: 'VALIDATION_ERROR',
                errors: data // np. { city: "wymagane", street: "za krótkie" }
            };
        }

        throw {
            status,
            message: data?.message || error.message || 'Wystąpił błąd'
        };
    } else if (error.request) {
        throw {
            status: null,
            message: 'Brak odpowiedzi z serwera. Sprawdź połączenie internetowe.'
        };
    } else {
        throw {
            status: null,
            message: error.message || 'Nieoczekiwany błąd'
        };
    }
};