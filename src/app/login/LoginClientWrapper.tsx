'use client'

import React from 'react'
import BPTicketLogin from './ClientLogin'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

const LoginClientWrapper = () => {
  const { status } = useSession()
  if (status === 'authenticated') {
    return redirect(`/dashboard`)
  }
  return (
    <>
      <BPTicketLogin />
      <ToastContainer />
    </>
  )
}

export default LoginClientWrapper
