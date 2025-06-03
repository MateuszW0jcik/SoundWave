import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('accessToken');
        if (!token) {
            token = sessionStorage.getItem('accessToken');
        }

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

            let refreshToken = localStorage.getItem('refreshToken');
            let storageType = 'localStorage';

            if (!refreshToken) {
                refreshToken = sessionStorage.getItem('refreshToken');
                storageType = 'sessionStorage';
            }

            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/token/refresh`,
                        { refreshToken },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    if (storageType === 'localStorage') {
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', newRefreshToken);
                    } else {
                        sessionStorage.setItem('accessToken', accessToken);
                        sessionStorage.setItem('refreshToken', newRefreshToken);
                    }

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('refreshToken');
                    window.dispatchEvent(new Event('auth-logout'));
                    return Promise.reject(refreshError);
                }
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                window.dispatchEvent(new Event('auth-logout'));
            }
        }

        return Promise.reject(error);
    }
);

export const handleApiError = (error, customMessage = 'API error') => {
    console.error(`${customMessage}:`, error);

    if (error.response) {
        const { status, data } = error.response;

        if (status === 400 && typeof data === 'object' && !Array.isArray(data) && !data.message) {
            throw {
                type: 'VALIDATION_ERROR',
                errors: data
            };
        }

        throw {
            status,
            message: data?.message || error.message || 'Error occurred'
        };
    } else if (error.request) {
        throw {
            status: null,
            message: 'No response from the server. Check your Internet connection.'
        };
    } else {
        throw {
            status: null,
            message: error.message || 'Unexpected error'
        };
    }
};
