import NextAuth, { AuthOptions, User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

interface UserWithId extends User {
  id: string;
  role?: string; // Add role here
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
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
  ],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/",
    error: "/",
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
            return "/";
          }
        } catch (error) {
          console.error("Error syncing user with backend:", error);
          return "/";
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // After successful authentication, redirect to dashboard
      if (url.startsWith('/auth/signin') || url.startsWith(baseUrl + '/auth/signin')) {
        return '/dashboard'
      }
      // If callback URL includes dashboard, keep it
      if (url.includes('/dashboard')) {
        return url
      }
      // For any other URLs, make them absolute
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      return url;
    },
    async jwt({ token, user }: { token: JWT; user?: UserWithId }) {
      if (user && user.id) {
        (token as JWT & { id?: string; role?: string }).id = user.id;
        if (user.role) {
          (token as JWT & { id?: string; role?: string }).role = user.role;
        }
      }
      return token;
    },
    async session(params: { session: Session; token: JWT; user: User } & { newSession: SessionWithId; trigger: "update" }) {
      const { session, token } = params;
      if (session.user && (token as JWT & { id?: string; role?: string }).id) {
        (session.user as UserWithId).id = (token as JWT & { id?: string; role?: string }).id!;
        if ((token as JWT & { id?: string; role?: string }).role) {
          (session.user as UserWithId).role = (token as JWT & { id?: string; role?: string }).role!;
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
