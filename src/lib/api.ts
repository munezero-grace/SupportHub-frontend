import { PingResponse, Stats, Ticket } from '@/types/interfaces/interface';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
async function handleApiResponse<T>(promise: Promise<Response>): Promise<T> {
  try {
    const res = await promise;
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('API request failed:', error.message);
    } else {
      console.error('API request failed:', String(error));
    }
    throw error;
  }
}

export async function pingBackend(): Promise<PingResponse | null> {
  try {
    return await handleApiResponse<PingResponse>(fetch(`${API_BASE_URL}/`));
  } catch {
    return null;
  }
}

export async function getDashboardStats(): Promise<Stats[]> {
  const response = await axiosInstance.get<Stats[]>('/stats');
  return response.data;
}

export async function getRecentTickets(): Promise<Ticket[]> {
  const response = await axiosInstance.get<Ticket[]>('/tickets/recent');
  return response.data;
}

export async function getTickets(): Promise<Ticket[]> {
  const response = await axiosInstance.get<Ticket[]>('/tickets');
  return response.data;
}
export async function loginClient(email: string, password: string): Promise<{ message: string }> {
  const response = await axiosInstance.post<{ message: string }>('/auth/login', {
    email,
    password
  });
  return response.data;
}