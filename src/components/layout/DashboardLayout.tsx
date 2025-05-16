"use client"
import Link from 'next/link'
import Image from 'next/image'
import { navigation } from '@/constants/navigation'
import { isMobileMenuOpen, 
         pathname, 
         notifications, 
         setIsMobileMenuOpen 
  } from '@/constants/MobileMenu'

import { AvatarIcon } from '@/components/icons'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="flex h-screen bg-gray-50">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-30 lg:z-0`}>
        <div className="flex h-16 items-center px-4">
          <Image
            src="/BP Ticket.png"
            alt="BP Ticket Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="ml-2 text-xl font-bold text-gray-700">BP Ticket</span>
        </div>
        
        <nav className="px-4 pt-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-2 my-1 text-sm font-medium rounded-lg ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex-1 overflow-auto w-full">
        <div className="h-16 bg-white shadow-sm px-4 lg:px-8 flex items-center justify-between">
          {/* Button to open the mobile menu */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <h1 className="text-xl font-semibold text-gray-700 hidden lg:block">
            {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="relative">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            <div className="flex items-center space-x-2">
              <AvatarIcon className="w-8 h-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Sarah Johnson</span>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
