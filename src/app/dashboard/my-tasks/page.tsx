'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { useNotifications } from '@/context/NotificationContext'
import { ticketService } from '@/services/tickets.service'
import { PriorityScoreBadge } from '@/components/tickets/PriorityScoreBadge'
import { Table } from '@/components/ui/Table'
import { TicketUpdateData } from '@/types/TicketTypes'

type AssignedTicket = {
  id: string
  ticketCode?: string
  title: string
  status: string
  priority: string
  priorityScore?: number | null
  createdAt: string
  client?: { companyName?: string | null } | null
}

const STATUS_OPTIONS = [
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
]

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  assigned: 'bg-purple-100 text-purple-700',
  awaiting_client: 'bg-orange-100 text-orange-700',
  resolved: 'bg-green-100 text-green-700',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function MyTasksPage() {
  const { data: session } = useSession()
  const { addNotification } = useNotifications()
  const [tickets, setTickets] = useState<AssignedTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    try {
      const data = await ticketService.getAssignedTickets()
      setTickets(Array.isArray(data) ? data : [])
    } catch {
      setTickets([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    setUpdatingId(ticketId)
    try {
      const payload: TicketUpdateData = { status: newStatus }
      await ticketService.updateTicket(ticketId, payload)
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      )
      const changed = tickets.find((t) => t.id === ticketId)
      addNotification({
        type: 'status_change',
        title: 'Status Updated',
        description: `"${changed?.title ?? 'Ticket'}" marked as ${newStatus.replace(/_/g, ' ')}.`,
        ticketCode: changed?.ticketCode,
      })
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const firstName = session?.user?.name?.split(' ')[0] || 'Developer'

  const columns = [
    {
      header: 'Title',
      accessor: (t: AssignedTicket) => (
        <div>
          <div className="font-medium text-gray-900 truncate max-w-[220px]">{t.title}</div>
          {t.ticketCode && (
            <div className="text-xs text-gray-400 font-mono mt-0.5">{t.ticketCode}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Client',
      accessor: (t: AssignedTicket) => (
        <span className="text-gray-700">{t.client?.companyName || '—'}</span>
      ),
    },
    {
      header: 'Priority Score',
      accessor: (t: AssignedTicket) => (
        <PriorityScoreBadge score={t.priorityScore} />
      ),
    },
    {
      header: 'Status',
      accessor: (t: AssignedTicket) => {
        const isUpdatable = STATUS_OPTIONS.some((o) => o.value === t.status) || t.status === 'assigned' || t.status === 'in_progress'
        return (
          <select
            value={t.status}
            disabled={updatingId === t.id}
            onChange={(e) => handleStatusChange(t.id, e.target.value)}
            className={`text-xs px-2 py-1 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 cursor-pointer ${STATUS_COLORS[t.status] ? 'border-transparent' : 'border-gray-300'}`}
          >
            {!STATUS_OPTIONS.find((o) => o.value === t.status) && (
              <option value={t.status}>{formatStatus(t.status)}</option>
            )}
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )
      },
    },
    {
      header: 'Created',
      accessor: (t: AssignedTicket) => (
        <span className="text-gray-500 text-sm">{formatDate(t.createdAt)}</span>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Tasks</h1>
          <p className="text-gray-500 text-sm mt-1">
            Tickets assigned to <strong>{firstName}</strong>
          </p>
        </div>
        <span className="text-sm text-gray-500">
          {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}
        </span>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 overflow-hidden">
          <div className="overflow-x-auto">
            <Table
              data={tickets}
              columns={columns}
              className="w-full min-w-[700px]"
              emptyState={
                <div className="text-center py-12">
                  <svg
                    className="w-12 h-12 text-gray-300 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  <p className="text-gray-500 font-medium">No tasks assigned yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Tickets assigned to you will appear here
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
