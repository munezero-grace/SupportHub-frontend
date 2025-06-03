import NextAuth, { type NextAuthOptions, User } from 'next-auth'
import axios from 'axios'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { GoogleProfile } from '@/types/auth'
import { handleAuthError } from '@/lib/auth-utils'

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'client',
          provider: 'google',
          providerId: profile.sub,
        }
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'email@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000'

        try {
          const response = await axios.post(`${backendUrl}/api/auth/login`, {
            email: credentials.email,
            password: credentials.password
          });

          const token = response.data.token
          if (!token) return null;

          const base64Payload = token.split('.')[1];
          const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());

          return {
            id: payload.id,
            name: `${payload.firstName} ${payload.lastName}`.trim(),
            email: payload.email,
            role: payload.role,
            provider: 'credentials',
            providerId: 'credentials',
            token: token,
            accessToken: token,
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to authenticate');
          }
          throw new Error('An unexpected error occurred');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'credentials') {
        return true
      }

      if (account?.provider === 'google') {
        try {
          const prof = profile as GoogleProfile
          const backendUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000'
          const response = await axios.post(
            `${backendUrl}/api/auth/google-signin`,
            {
              email: user.email,
              firstName: prof.given_name ?? '',
              lastName: prof.family_name ?? 'lastName',
              provider: account.provider,
              providerId: prof.sub,
              role: prof.role
            }
          )

          if (response.status < 200 || response.status >= 300) {
            handleAuthError(
              { status: response.status, data: response.data },
              'google-signin'
            )
            return false
          }

          const token = response.data.token
          if (token) {
            try {
              const base64Payload = token.split('.')[1]
              const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString())
              user.role = payload.role
              user.accessToken = token
            } catch {
            }
          }

          return true
        } catch {
          return false;
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        const extendedUser = user as User

        token.id = extendedUser.id
        token.email = extendedUser.email ?? ''
        token.name = extendedUser.name || ''
        token.role = extendedUser.role || 'client'
        token.provider = extendedUser.provider || account?.provider || 'credentials'
        token.providerId = extendedUser.providerId || account?.providerAccountId || ''
        token.token = extendedUser.token || ''
        token.accessToken = extendedUser.accessToken || ''
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture || null,
          role: token.role,
          provider: token.provider,
          providerId: token.providerId,
          token: token.token,
          accessToken: token.accessToken
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.includes('signout')) {
        return baseUrl
      }
      if (url.includes('/dashboard')) {
        return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`
      }
      if (url === baseUrl || url === `${baseUrl}/`) {
        return baseUrl
      }
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
};

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }