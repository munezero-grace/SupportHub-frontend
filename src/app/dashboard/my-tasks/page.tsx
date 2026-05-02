'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ticketService } from '@/services/tickets.service'
import { mapTickets } from '@/utils/mapTickets'
import type { Ticket } from '@/types/interfaces/interface'
import EditTicketModal from '@/components/tickets/EditTicketModal'

const STATUS_COLORS: Record<string, string> = {
  open:        'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  resolved:    'bg-green-100 text-green-700',
  closed:      'bg-gray-100 text-gray-600',
  pending:     'bg-purple-100 text-purple-700',
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-yellow-100 text-yellow-700',
  low:      'bg-green-100 text-green-700',
}

type StatusFilter = '' | 'open' | 'in_progress' | 'resolved' | 'closed'

export default function MyTasksPage() {
  const { data: session } = useSession()
  const [tasks, setTasks]             = useState<Ticket[]>([])
  const [loading, setLoading]         = useState(true)
  const [selectedTask, setSelectedTask] = useState<Ticket | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('')
  const [search, setSearch]           = useState('')

  useEffect(() => {
    ticketService
      .getUserTickets()
      .then((data) => {
        const all = mapTickets(Array.isArray(data) ? data : [])
        const userId = session?.user?.id
        setTasks(userId ? all.filter((t) => t.assignee === userId) : all)
      })
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }, [session?.user?.id])

  const visibleTasks = tasks.filter((t) => {
    const matchesStatus = !statusFilter || t.status.toLowerCase() === statusFilter
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const stats = {
    total:      tasks.length,
    open:       tasks.filter((t) => t.status.toLowerCase() === 'open').length,
    inProgress: tasks.filter((t) => t.status.toLowerCase() === 'in_progress').length,
    resolved:   tasks.filter((t) => t.status.toLowerCase() === 'resolved').length,
  }

  const firstName = session?.user?.name?.split(' ')[0] || 'you'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-500 text-sm mt-1">
          Tasks assigned to you, <strong>{firstName}</strong>
        </p>
      </div>

      {/* Stat cards — clickable to filter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',       value: stats.total,      color: 'text-gray-900',   filter: '' as StatusFilter },
          { label: 'Open',        value: stats.open,       color: 'text-blue-600',   filter: 'open' as StatusFilter },
          { label: 'In Progress', value: stats.inProgress, color: 'text-yellow-600', filter: 'in_progress' as StatusFilter },
          { label: 'Resolved',    value: stats.resolved,   color: 'text-green-600',  filter: 'resolved' as StatusFilter },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => setStatusFilter(statusFilter === stat.filter ? '' : stat.filter)}
            className={`bg-white rounded-xl border p-5 text-left transition-all duration-150 ${
              statusFilter === stat.filter
                ? 'border-gray-900 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      {/* Task list */}
      {visibleTasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-14 text-center">
          <svg
            className="w-12 h-12 text-gray-300 mx-auto mb-3"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="text-gray-500 font-medium">
            {search || statusFilter ? 'No tasks match your filters' : 'No tasks assigned to you yet'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Tasks assigned by your admin will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleTasks.map((task) => {
            const status   = task.status?.toLowerCase() || 'open'
            const priority = task.priority?.toLowerCase() || 'low'

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm hover:border-gray-300 transition-all duration-150 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Badges row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-mono text-gray-400">
                        {task.ticketCode || `#${task.id.slice(0, 8)}`}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
                        {status.replace(/_/g, ' ')}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[priority] || 'bg-gray-100 text-gray-600'}`}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {task.title}
                    </h3>

                    {/* Description */}
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Right side: due date + update cue */}
                  <div className="flex-shrink-0 text-right">
                    {task.dueDate && (
                      <p className="text-xs text-gray-400">
                        Due{' '}
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                    <span className="mt-2 inline-block text-xs font-medium text-gray-500 hover:text-gray-900">
                      Update status →
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit / update modal */}
      {selectedTask && (
        <EditTicketModal
          isOpen
          onClose={() => setSelectedTask(null)}
          ticket={selectedTask}
        />
      )}
    </div>
  )
}
