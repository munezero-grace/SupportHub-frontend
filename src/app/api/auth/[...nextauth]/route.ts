import NextAuth, { AuthOptions, User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

interface UserWithId extends User {
  id: string;
}

interface SessionWithId extends Session {
  user?: UserWithId;
}

interface GoogleProfile {
  given_name?: string;
  family_name?: string;
  sub?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const user = await res.json();

        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const prof = profile as GoogleProfile;
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
          const res = await fetch(`${backendUrl}/api/auth/google-signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              firstName: prof.given_name || "",
              lastName: prof.family_name || "defaultLastName",
              provider: account.provider,
              providerId: prof.sub,
            }),
          });
          if (res.ok) {
            return true;
          } else {
            const errorBody = await res.text();
            console.error("Google sign-in backend error:", res.status, errorBody);
            return false;
          }
        } catch (error) {
          console.error("Error syncing user with backend:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }: { token: JWT; user?: UserWithId }) {
      if (user && user.id) {
        (token as JWT & { id?: string }).id = user.id;
      }
      return token;
    },
    async session(params: { session: Session; token: JWT; user: User } & { newSession: SessionWithId; trigger: "update" }) {
      const { session, token } = params;
      if (session.user && (token as JWT & { id?: string }).id) {
        (session.user as UserWithId).id = (token as JWT & { id?: string }).id!;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
