import type { JWT as NextAuthJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image: string | null
      role: string
      token: string
      accessToken: string
      provider: string
      providerId: string
      emailVerified?: Date | null
    }
  }

  interface User {
    id: string
    name: string
    email: string
    image?: string | null
    role: string
    token?: string
    accessToken?: string
    provider: string
    providerId: string
    firstName?: string
    lastName?: string
    emailVerified?: Date | null
  }
}

declare module "next-auth/jwt" {
  interface JWT extends NextAuthJWT {
    id: string
    name: string
    email: string
    role: string
    token: string
    accessToken: string
    provider: string
    providerId: string
    picture?: string | null
  }
}
