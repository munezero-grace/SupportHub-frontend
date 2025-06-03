import NextAuth from 'next-auth'
import axios from 'axios'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { GoogleProfile } from '@/types/auth'
import { handleAuthError } from '@/lib/auth-utils'
import type { JWT } from 'next-auth/jwt'
import { debug } from 'console'
import type { ExtendedUser } from '@/types/next-auth'

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
          role: profile.role,
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
          process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000'
        try {
          const response = await axios.post(`${backendUrl}/api/auth/login`, {
            email: credentials.email,
            password: credentials.password,
            provider: 'credentials',
          })

          const token = response.data.token

          if (token) {
            const base64Payload = token.split('.')[1]
            const payload = JSON.parse(
              Buffer.from(base64Payload, 'base64').toString()
            )

            return {
              id: payload.id,
              firstName: payload.firstName,
              lastName: payload.lastName,
              email: payload.email,
              image: payload.picture,
              role: payload.role,
              provider: payload.provider,
              providerId: payload.providerId,
            }
          }
        } catch (error) {
          debug('Error during credentials authorization:', error)
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
            } catch {

            }
          }

          return true
        } catch (error) {
          debug("Error syncing user with backend:", error);
          return false;
        }
      }
      return true
    },
    async jwt({
      token,
      user,
    }: {
      token: JWT
      user?: ExtendedUser
    }): Promise<JWT> {
      if (user) {
        if (typeof user === 'string') {
          try {
            const payload = JSON.parse(
              Buffer.from((user as string).split('.')[1], 'base64').toString()
            )
            token = { ...token, ...payload }
            if (!token.name && token.firstName && token.lastName) {
              token.name = `${token.firstName} ${token.lastName}`.trim()
            }
          } catch { }
        } else if ('token' in user && typeof user.token === 'string') {
          try {
            const payload = JSON.parse(
              Buffer.from(
                (user.token as string).split('.')[1],
                'base64'
              ).toString()
            )
            token = { ...token, ...payload }
            if (!token.name && token.firstName && token.lastName) {
              token.name = `${token.firstName} ${token.lastName}`.trim()
            }
          } catch { }
        } else {
          token.id = user.id
          token.role = user.role ?? undefined
          token.name = user.name ?? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
          token.email = user.email
          token.picture = user.image
          token.provider = user.provider
          token.providerId = user.providerId
        }
      }
      return token
    },
    async session({
      session,
      token,
    }: {
      session: import('next-auth').Session
      token: JWT
    }) {
      if (session.user) {
        const user = session.user as ExtendedUser
        user.id = token.id as string
        user.role = token.role as string
        user.name = token.name as string
        user.provider = token.provider as string
        user.providerId = token.providerId as string
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