import { axiosInstance } from '@/lib/api';
import { Product, ProductFormData } from '@/types/interfaces/product';
import { AxiosError } from 'axios';


const BASE_URL = '/api/products';

export const productService = {
    getProducts: async (): Promise<Product[]> => {
        try {
            const response = await axiosInstance.get<Product[]>(BASE_URL);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw error;
        }
    },

    getProduct: async (id: string): Promise<Product> => {
        try {
            const response = await axiosInstance.get<Product>(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw error;
        }
    },
    createProduct: async (productData: ProductFormData): Promise<Product> => {
        try {
            const normalizedData = {
                ...productData,
                status: productData.status.toLowerCase() as 'active' | 'inactive',
                description: productData.description.trim()
            };
            const response = await axiosInstance.post<Product>(BASE_URL, normalizedData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw error;
        }
    },
    updateProduct: async (id: string, productData: Partial<ProductFormData>): Promise<Product> => {
        try {
            const normalizedData = {
                ...productData,
                status: productData.status ? productData.status.toLowerCase() as 'active' | 'inactive' : undefined,
                description: productData.description ? productData.description.trim() : undefined
            };
            const response = await axiosInstance.put<Product>(`${BASE_URL}/${id}`, normalizedData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw error;
        }
    },

    deleteProduct: async (id: string): Promise<void> => {
        try {
            await axiosInstance.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw error;
        }
    }
};
