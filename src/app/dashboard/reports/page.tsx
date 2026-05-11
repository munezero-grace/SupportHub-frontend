'use client'

import { useEffect, useState } from 'react'
import { dashboardAPI } from '@/services/dashboard.service'
import { DashboardData } from '@/types/dashboard.types'

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  awaiting_client: 'bg-orange-100 text-orange-700',
  resolved: 'bg-green-100 text-green-700',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  in_progress: 'In Progress',
  awaiting_client: 'Awaiting Client',
  resolved: 'Resolved',
}

export default function ReportsPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dashboardAPI.getAllDashboardData()
        setData(result)
      } catch {
        setError('Failed to load report data.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error || 'No data available.'}</p>
      </div>
    )
  }

  const { overview, tickets, clients, products } = data

  const totalTickets = overview?.stats?.totalTickets ?? 0
  const openTickets = overview?.stats?.openTickets ?? 0
  const resolvedCount = tickets?.resolved?.length ?? 0

  const statusCounts = [
    { key: 'new', count: tickets?.new?.length ?? 0 },
    { key: 'in_progress', count: tickets?.in_progress?.length ?? 0 },
    { key: 'awaiting_client', count: tickets?.awaiting_client?.length ?? 0 },
    { key: 'resolved', count: resolvedCount },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Live overview of support operations</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tickets" value={totalTickets} color="border-blue-500" />
        <StatCard label="Open Tickets" value={openTickets} color="border-yellow-500" />
        <StatCard label="Resolved Tickets" value={resolvedCount} color="border-green-500" />
        <StatCard label="Total Clients" value={clients?.totalClients ?? 0} color="border-purple-500" />
      </div>

      {/* Tickets by Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Tickets by Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statusCounts.map(({ key, count }) => (
            <div key={key} className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
              <span className={`text-xs font-medium px-2 py-1 rounded-full mb-2 ${STATUS_COLORS[key]}`}>
                {STATUS_LABELS[key]}
              </span>
              <span className="text-3xl font-bold text-gray-800">{count}</span>
            </div>
          ))}
        </div>

        {totalTickets > 0 && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Distribution</p>
            <div className="flex h-4 rounded-full overflow-hidden">
              {statusCounts.map(({ key, count }) => {
                const pct = totalTickets > 0 ? (count / totalTickets) * 100 : 0
                const bgColors: Record<string, string> = {
                  new: 'bg-blue-400',
                  in_progress: 'bg-yellow-400',
                  awaiting_client: 'bg-orange-400',
                  resolved: 'bg-green-400',
                }
                return pct > 0 ? (
                  <div
                    key={key}
                    className={`${bgColors[key]} transition-all`}
                    style={{ width: `${pct}%` }}
                    title={`${STATUS_LABELS[key]}: ${count}`}
                  />
                ) : null
              })}
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {statusCounts.map(({ key, count }) => {
                const dotColors: Record<string, string> = {
                  new: 'bg-blue-400',
                  in_progress: 'bg-yellow-400',
                  awaiting_client: 'bg-orange-400',
                  resolved: 'bg-green-400',
                }
                return (
                  <div key={key} className="flex items-center gap-1 text-xs text-gray-500">
                    <span className={`w-2 h-2 rounded-full ${dotColors[key]}`} />
                    {STATUS_LABELS[key]} ({count})
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Clients & Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Client Summary</h2>
          <div className="space-y-3">
            <SummaryRow label="Total Clients" value={clients?.totalClients ?? 0} />
            <SummaryRow label="Active Clients" value={clients?.activeClients ?? 0} />
            <SummaryRow label="Premium Clients" value={clients?.premiumClients ?? 0} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Product Summary</h2>
          <div className="space-y-3">
            <SummaryRow label="Total Products" value={products?.totalProducts ?? 0} />
            <SummaryRow label="Active Products" value={products?.activeProducts ?? 0} />
            <SummaryRow
              label="Most Active Product"
              value={products?.mostActiveProduct?.name ?? '—'}
              sub={products?.mostActiveProduct ? `${products.mostActiveProduct.ticketCount} tickets` : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${color}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  )
}

function SummaryRow({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="text-right">
        <span className="text-sm font-semibold text-gray-800">{value}</span>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  )
}
