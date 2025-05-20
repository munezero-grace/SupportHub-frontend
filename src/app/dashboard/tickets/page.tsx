"use client"

import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useTicketsQuery } from '@/hooks/useQueries'

export default function TicketsPage() {
  const { data: tickets, isLoading, error } = useTicketsQuery()

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load tickets. Please try again later.
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Tickets</h1>
          <p className="text-gray-600">Manage and track support tickets</p>
        </div>
        <Button>New Ticket</Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search tickets..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Sort</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b">
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Title</th>
                <th className="p-4">Client</th>
                <th className="p-4">Product</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Assignee</th>
                <th className="p-4">Created</th>
                <th className="p-4">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets?.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  className="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4">{ticket.id}</td>
                  <td className="p-4">{ticket.title}</td>
                  <td className="p-4">{ticket.client}</td>
                  <td className="p-4">{ticket.product}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-4">{ticket.assignee}</td>
                  <td className="p-4">{ticket.created}</td>
                  <td className="p-4 text-gray-500">{ticket.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
