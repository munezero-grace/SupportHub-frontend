import axiosInstance from './axiosInstance'
import { Client, CreateClientDto, UpdateClientDto } from '../types/clients'

const BASE_URL = '/api/clients'

export const clientsApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<{
      status: string
      data: Client[]
    }>(BASE_URL)
    return data.data
  },

  getById: async (clientCode: string) => {
    const { data } = await axiosInstance.get<{ status: string; data: Client }>(
      `${BASE_URL}/${clientCode}`
    )
    return data.data
  },

  create: async (clientData: CreateClientDto) => {
    const { data } = await axiosInstance.post<{ status: string; data: Client }>(
      BASE_URL,
      clientData
    )
    return data.data
  },

  update: async (clientCode: string, updateData: UpdateClientDto) => {
    const { data } = await axiosInstance.patch<{
      status: string
      data: Client
    }>(`${BASE_URL}/${clientCode}`, updateData)
    return data.data
  },

  delete: async (clientCode: string) => {
    await axiosInstance.delete(`${BASE_URL}/${clientCode}`)
  },

  getProductsForClient: async (clientCode: string) => {
    const { data } = await axiosInstance.get(`/api/clients/${clientCode}/products`)
    return data
  },

  addProductToClient: async (clientCode: string, productId: string) => {
    const { data } = await axiosInstance.post(`/api/clients/${clientCode}/products/${productId}`)
    return data
  },

  removeProductFromClient: async (clientCode: string, productId: string) => {
    await axiosInstance.delete(`/api/clients/${clientCode}/products/${productId}`)
  }
}
