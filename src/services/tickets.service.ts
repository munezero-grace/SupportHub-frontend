import { axiosInstance } from '@/lib/api'
import { AxiosError } from 'axios'

interface TicketUpdateData {
  ticketCode?: string
  title?: string
  status?: string
  priority?: string
  imageUrl?: string
  clientId?: string
  productId?: string
  description?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  tags?: string
  dueDate?: string
}

const BASE_URL = '/api/tickets';

export const ticketService = {
  createTicket: async (ticketData: FormData) => {
    try {
      const response = await axiosInstance.post(BASE_URL, ticketData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw error
    }
  },

  getUserTickets: async () => {
    try {
      const response = await axiosInstance.get(BASE_URL);
      if (!response.data) {
        throw new Error('No tickets found');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || error.message;
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch tickets. Please try again.');
    }
  },

  getTicketById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/${id}`)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw error
    }
  },

  updateTicket: async (id: string, ticketData: TicketUpdateData) => {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/${id}`, ticketData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw error
    }
  },

  deleteTicket: async (id: string) => {
    try {
      await axiosInstance.delete(`${BASE_URL}/${id}`)
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw error
    }
  },
}
