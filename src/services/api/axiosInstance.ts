import axios from 'axios';
import { getSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
    const session = await getSession();
    if (session?.user?.id) {
      config.headers.Authorization = `Bearer ${session.user.id}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: '/' });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
