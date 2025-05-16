import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const [isSigningIn, setIsSigningIn] = useState(false)
export const router = useRouter()
export const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    setTimeout(() => {
      setIsSigningIn(false)
      router.push('/dashboard')
    }, 1000)
  }
  