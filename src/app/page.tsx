"use client"

import { useState } from 'react'
import Image from 'next/image'
import { GoogleIcon } from '../components/icons'
import { Button } from '../components/ui/Button'

export default function Home() {
  const [isSigningIn, setIsSigningIn] = useState(false)
 
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    setTimeout(() => {
      setIsSigningIn(false)
    }, 1000)
  }
 
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 space-y-6">
      <div className="flex flex-col items-center space-y-3">
        <Image
          src="/BP Ticket.png"
          alt="BP Ticket Logo"
          width={80}
          height={80}
          className="object-contain"
        />
        <h1 className="text-2xl font-bold text-gray-700">BP Ticket</h1>
        <p className="text-sm font-medium text-gray-600">Support Ticket Management</p>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-700">Sign In</h2>
          <p className="text-sm font-normal text-gray-600">Use your Google account to continue</p>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          loading={isSigningIn}
          variant="outline"
          className="w-full flex items-center justify-center gap-3"
        >
          <GoogleIcon />
          {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
        </Button>

        <div className="text-center">
          <a href="#" className="text-sm text-green-700 hover:underline">
            Client login
          </a>
        </div>
      </div>
    </div>
  )
}
