'use client'

import { SessionProvider } from 'next-auth/react'
import QueryProvider from '@/providers/QueryProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
        <ToastContainer />
      </QueryProvider>
    </SessionProvider>
  )
}
