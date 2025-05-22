import NextAuth from 'next-auth'
import axios from 'axios'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { GoogleProfile } from '@/types/auth'
import { handleAuthError } from '@/lib/auth-utils'
import type { JWT } from 'next-auth/jwt'
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
          role: profile.role ?? 'client',
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
        if (!credentials?.email || !credentials?.password) return null
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000'
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
              provider: "credentials",
            }
          )
          const user = data.user
          console.log("Authorize user object:", user);
          if (user) {
            const name = user.name ?? (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '')
            return {
              id: user.id ?? user._id ?? '',
              name: name,
              email: user.email,
              role: user.role ?? 'client',
              image: user.image,
            }
          }
        } catch (error) {
          console.error("Authorize error:", error);
          return null
        }
        return null
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
            process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000'
          const response = await axios.post(
            `${backendUrl}/api/auth/google-signin`,
            {
              email: user.email,
              firstName: prof.given_name ?? '',
              lastName: prof.family_name ?? 'default-lastName',
              provider: account.provider,
              providerId: prof.sub,
            }
          )
          if (response.status < 200 || response.status >= 300) {
            handleAuthError(
              { status: response.status, data: response.data },
              'google-signin'
            )
            return false
          }
          return true
        } catch (error) {
          handleAuthError(error, 'google-sync')
          return false
        }
      }
      return true
    },
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string | undefined
        session.user.name = token.name as string | undefined
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.includes('signout')) {
        return '/'
      }
      if (
        url.startsWith('/auth/signin') ||
        url.startsWith(baseUrl + '/auth/signin')
      ) {
        return '/dashboard'
      }
      if (url.includes('/dashboard')) {
        return url
      }
      return url.startsWith('/') ? `${baseUrl}${url}` : url
    },
  },
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
