import axios from 'axios';
import { getSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('Response error:', error);
    
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: '/' });
    }
    
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    error.message = errorMessage;
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
