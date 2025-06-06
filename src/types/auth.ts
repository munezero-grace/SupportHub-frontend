import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
      token: string
      accessToken: string
      provider: string
      providerId: string
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
