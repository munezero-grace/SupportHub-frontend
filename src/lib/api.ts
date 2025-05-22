import { PingResponse, Stats, Ticket } from '@/types/interfaces/interface';
import { recentTickets } from '@/constants/recentTickets';
import { stats } from '@/constants/stats';
import { handleError } from '@/lib/error-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

async function handleApiResponse<T>(promise: Promise<Response>): Promise<T> {
  try {
    const res = await promise;
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return res.json();
  } catch (error: unknown) {
    handleError(error, 'api-request');
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
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return stats;
}

export async function getRecentTickets(): Promise<Ticket[]> {
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return recentTickets;
}

export async function getTickets(): Promise<Ticket[]> {
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return recentTickets;
}
export async function loginClient(email: string, password: string): Promise<{ message: string }> {
  const response = await handleApiResponse(
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
  )
  return response as { message: string }
}