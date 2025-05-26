import React, { useState } from "react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { toast } from "react-toastify"
import { signIn } from "next-auth/react"

const BPTicketLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await signIn("credentials", {
      redirect: false,
      provider: "credentials",
      email,
      password,
      callbackUrl: window.location.origin + "/dashboard",
    })
    setIsLoading(false)
    if (result?.error) {
      toast.error("Invalid email or password")
    } else if (result?.ok) {
      toast.success("Login successful")
      window.location.href = "/dashboard"
    }
  }

  return (
    <>
      <Head>
        <title>BP Ticket - Client Login</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            src="/BP Ticket.png"
            alt="BP Ticket Logo"
            width={80}
            height={80}
            className="object-contain mx-auto"
          />
          <h1 className="text-3xl font-bold text-center text-black mt-4">BP Ticket</h1>
          <h2 className="mt-2 text-center text-lg font-medium text-gray-400">
            Client Support Portal
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h3 className="text-3xl font-medium text-black mb-1">Client Login</h3>
            <p className="text-sm text-gray-400 mb-6">Sign in to access your support tickets</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="new-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm text-black"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-medium text-black">
                    Password
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm text-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/">
                <span className="text-md text-blue-600 hover:text-blue-500 cursor-pointer">
                  Back to main login
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BPTicketLogin
