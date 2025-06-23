import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: process.env.NNEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const updateUserSettings = async (settings: { companyName: string; companyDomain: string; firstName?: string; lastName?: string }) => {
    return axiosInstance.put('/users/settings', settings);
};

export const getUserSettings = async () => {
    return axiosInstance.get('/users/settings');
};

