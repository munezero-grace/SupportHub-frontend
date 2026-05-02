'use client'
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { ticketService } from '@/services/tickets.service'

export type NotificationType = 'new_ticket' | 'status_change' | 'ticket_assigned' | 'info' | 'warning'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: string
  read: boolean
}

interface NotificationContextValue {
  notifications: AppNotification[]
  unreadCount: number
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

const STORAGE_KEY = 'supporthub_notifications'
const LAST_CHECK_KEY = 'supporthub_last_ticket_check'
const POLL_INTERVAL = 30000

function loadFromStorage(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(notifications: AppNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, 50)))
  } catch {}
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const lastCheckRef = useRef<string>(localStorage.getItem(LAST_CHECK_KEY) || new Date().toISOString())

  useEffect(() => {
    setNotifications(loadFromStorage())
  }, [])

  useEffect(() => {
    saveToStorage(notifications)
  }, [notifications])

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const notification: AppNotification = {
      ...n,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: new Date().toISOString(),
      read: false,
    }
    setNotifications((prev) => [notification, ...prev.slice(0, 49)])
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Poll for new tickets every 30 seconds
  useEffect(() => {
    const poll = async () => {
      try {
        const tickets = await ticketService.getUserTickets()
        const arr = Array.isArray(tickets) ? tickets : []
        const lastCheck = lastCheckRef.current
        const newTickets = arr.filter((t: any) => t.createdAt > lastCheck)
        newTickets.forEach((ticket: any) => {
          addNotification({
            type: 'new_ticket',
            title: 'New Ticket Submitted',
            description: ticket.title || 'A new support ticket has been submitted.',
          })
        })
        if (newTickets.length > 0) {
          lastCheckRef.current = new Date().toISOString()
          localStorage.setItem(LAST_CHECK_KEY, lastCheckRef.current)
        }
      } catch {}
    }

    const interval = setInterval(poll, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [addNotification])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
