'use client'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'
import { GoogleIcon } from '../components/icons'
import { Button } from '../components/ui/Button'
import Link from 'next/link'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { redirect } from 'next/navigation'

export default function Home() {
  const { status } = useSession()
  if (status === 'authenticated') {
    return redirect(`/dashboard`)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 space-y-6">
      <ToastContainer />
      <div className="flex flex-col items-center space-y-3">
        <Image
          src="/BP Ticket.png"
          alt="BP Ticket Logo"
          width={80}
          height={80}
          className="object-contain"
        />
        <h1 className="text-2xl font-bold text-gray-700">BP Ticket</h1>
        <p className="text-sm font-medium text-gray-600">
          Support Ticket Management
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-700">Sign In</h2>
          <p className="text-sm font-normal text-gray-600">
            Use your Google account to continue
          </p>
        </div>

        <Button
          onClick={() =>
            signIn('google', {
              prompt: 'select_account',
              callbackUrl: '/dashboard',
            })
          }
          variant="outline"
          className="w-full flex items-center justify-center gap-3"
        >
          <GoogleIcon />
          Sign in with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>
        <div className="mt-4 text-center w-full">
          <Link href="/login">
            <span className="text-blue-600 hover:text-blue-500 font-medium cursor-pointer">
              Login with password
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
