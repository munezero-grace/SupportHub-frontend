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

    fetchProductsWithActiveClients: async (): Promise<Product[]> => {
        try {
            const response = await axiosInstance.get<Product[]>(BASE_URL);
            const productsWithActiveClients = response.data.map((product: Product) => ({
                ...product,
                activeClients: product.clientProducts ? product.clientProducts.length : 0,
            }));
            return productsWithActiveClients;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw error;
        }
    },

    getProduct: async (productCode: string): Promise<Product> => {
        try {
            const response = await axiosInstance.get<Product>(`${BASE_URL}/${productCode}`);
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
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    throw new Error('You must be logged in to perform this action');
                }
                if (error.response?.status === 403) {
                    throw new Error('You do not have permission to perform this action');
                }
                if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
            }
            throw new Error('Failed to create product');
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
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    throw new Error('You must be logged in to perform this action');
                }
                if (error.response?.status === 403) {
                    throw new Error('You do not have permission to perform this action');
                }
                if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
            }
            throw new Error('Failed to update product');
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
    },

    getClientsForProduct: async (productId: string) => {
        const { data } = await axiosInstance.get(`/api/products/${productId}/clients`);
        return data;
    },

    addClientToProduct: async (productId: string, clientId: string) => {
        const { data } = await axiosInstance.post(`/api/products/${productId}/clients/${clientId}`);
        return data;
    },

    removeClientFromProduct: async (productId: string, clientId: string) => {
        await axiosInstance.delete(`/api/products/${productId}/clients/${clientId}`);
    }
};

export const productsService = {
    getAll: async (): Promise<Product[]> => {
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

    addClientToProduct: async (productId: string, clientId: string) => {
        try {
            const { data } = await axiosInstance.post(`${BASE_URL}/${productId}/clients/${clientId}`);
            return data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw error;
        }
    }
};
