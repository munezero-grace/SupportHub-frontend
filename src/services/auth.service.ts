
import axios from 'axios'
import type { GoogleProfile } from '../types/auth'

const backendUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000'


export interface LoginCredentials {
  email: string
  password: string
}

export const login = async ({ email, password }: LoginCredentials) => {
  const response = await axios.post(`${backendUrl}/api/auth/login`, {
    email,
    password,
  })
  return response
}



export const socialSignup = async (payload: GoogleProfile) => {
  const response = await axios.post(
    `${backendUrl}/api/auth/google-signin`,
    payload
  )
  
  return response.data
}
