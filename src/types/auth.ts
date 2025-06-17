import { DefaultSession } from "next-auth"
import { AxiosError, InternalAxiosRequestConfig } from 'axios'

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
      token: string
      accessToken: string
      provider: string
      providerId: string
      firstName?: string
      lastName?: string
      client?: {
        id: string;
        clientCode: string;
        companyName: string | null;
      }
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    token?: string
    accessToken?: string
    provider: string
    providerId: string
    firstName?: string
    lastName?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    token: string
    accessToken: string
    provider: string
    providerId: string
    client?: {
      id: string;
      clientCode: string;
      companyName: string;
    }
  }
}

export interface GoogleProfile {
  given_name?: string
  family_name?: string
  sub?: string
  picture?: string
  email?: string
  name?: string
  role?: string
  emailVerified?: Date | null
}

export type CustomUser = {
  id: string;
  client?: {
    id: string;
    clientCode: string;
    companyName: string;
  };
  email: string;
  name?: string | null;
  image?: string | null;
  token?: string;
  role?: string;
  provider?: string;
  providerId?: string;
  firstName?: string;
  lastName?: string;
}


export interface QueueItem {
  resolve: (token: string) => void
  reject: (error: AxiosError | Error) => void
}

export interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export interface ErrorResponse {
  message?: string
}

export interface LoginCredentials {
  email: string
  password: string
}
