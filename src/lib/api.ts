import { PingResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export async function pingBackend(): Promise<PingResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/test`)
    const data = (await res.json()) as PingResponse
    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Backend connection failed:', error.message)
    } else {
      console.error('Backend connection failed:', String(error))
    }
    return null
  }
}
