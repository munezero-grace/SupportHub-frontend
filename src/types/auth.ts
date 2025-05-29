import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as NextAuthJWTType } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
      accessToken?: string;
      provider?: string;
      providerId?: string;
      emailVerified?: Date | null;
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string;
    role?: string | null;
    token?: string;
    accessToken?: string;
    provider?: string;
    providerId?: string;
    emailVerified?: Date | null;
    firstName?: string;
    lastName?: string;
  }
}

declare module "next-auth/jwt" {
  interface CustomJWT extends NextAuthJWTType {
    id?: string;
    role?: string;
    accessToken?: string;
    provider?: string;
    providerId?: string;
    emailVerified?: Date | null;
  }
}

export interface GoogleProfile {
  given_name?: string;
  family_name?: string;
  sub?: string;
  picture?: string;
  email?: string;
  name?: string;
  role?: string;
  emailVerified?: Date | null;
}
