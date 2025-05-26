'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ReactNode, useState, useEffect, useRef } from 'react'
import { navigation } from '@/constants/navigation'
import { usePathname } from 'next/navigation'
import { getNavItemStyles } from '@/lib/styles'
import { AvatarIcon } from '@/components/icons'
import { signOut, useSession } from 'next-auth/react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.replace('/')
    },
  })
  console.log('Session:', session)

  useEffect(() => {
    if (status === 'unauthenticated' as string) {
      window.history.pushState(null, '', '/')
      window.addEventListener('popstate', () => {
        window.history.forward()
      })
    }
    return () => {
      window.removeEventListener('popstate', () => {
        window.history.forward()
      })
    }
  }, [status])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-[#E5E7EB] flex flex-col z-20">
        <div className="h-16 flex items-center px-4 border-b border-[#E5E7EB]">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="/BP Ticket.png"
              alt="BP Ticket"
              width={40}
              height={40}
              priority
            />
            <span className="text-[#111827] text-lg font-bold">BP Ticket</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={getNavItemStyles(isActive).container}
                  >
                    <item.icon
                      className={getNavItemStyles(isActive).icon}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
      <div className="pl-62 w-full">
        <header className="h-16 flex items-center justify-between px-5 bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
          <div className="flex items-center">
            <span className="text-[#111827] text-xl font-bold p-2.5">
              BP Ticket
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg
                className="w-6 h-6 text-[#4B5563] cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0h-6"
                />
              </svg>
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-medium text-white bg-black rounded-full">
                3
              </span>
            </div>

            <div className="relative profile-menu-container" ref={profileRef}>
              <button
                type="button"
                className="flex items-center space-x-3 text-sm focus:outline-none cursor-pointer"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="h-8 w-8 rounded-full bg-[#111827] text-white flex items-center justify-center overflow-hidden cursor-pointer">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <AvatarIcon className="h-5 w-5" />
                  )}
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 py-1 bg-white rounded-lg shadow-lg border border-[#E5E7EB] z-50">
                  <div className="px-4 py-2  border-b border-[#E5E7EB]">
                    <span className="text-sm text-[#111827] font-extrabold capitalize">
                      {session?.user?.name}
                    </span>

                    <div className="text-gray-500">
                      <p className='truncate'>{session?.user?.email}</p>
                      <p className="capitalize">{session?.user?.role}</p>
                    </div>
                  </div>

                  <div className="text-black font-normal">
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm hover:bg-[#F9FAFB] cursor-pointer"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm hover:bg-[#F9FAFB] cursor-pointer"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Settings
                    </Link>
                    <div className="border-t border-[#E5E7EB]"></div>
                    <button
                      onClick={() =>
                        signOut({
                          redirect: true,
                          callbackUrl: '/',
                        })
                      }
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-[#F9FAFB] cursor-pointer"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="p-7">{children}</main>
      </div>
    </div>
  )
}
