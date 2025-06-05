/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

const backendUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const login = async ({ email, password }: any) => {
  const response = await axios.post(`${backendUrl}/api/auth/login`, {
    email,
    password,
  })
  return response
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const socialSignup = async (payload: any) => {
  const response = await axios.post(
    `${backendUrl}/api/auth/google-signin`,
    payload
  )
  
  return response.data
}
