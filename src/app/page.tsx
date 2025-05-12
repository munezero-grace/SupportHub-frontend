'use client'

import { useEffect, useState } from 'react'
import { pingBackend } from '@/lib/api'

export default function Home() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    pingBackend().then((data) => {
      if (data) setMessage(data.message)
    })
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold">BP Ticket Frontend</h1>
      <p className="mt-4 text-xl text-blue-600">{message || 'Loading...'}</p>
    </main>
  )
}
