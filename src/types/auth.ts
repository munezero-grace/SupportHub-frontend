import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface AppJWT extends NextAuthJWT {
    id?: string;
    role?: string;
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
}
