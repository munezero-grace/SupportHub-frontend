"use client"

import { Button } from '@/components/ui/Button'
import { clients } from '@/constants/clients'

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Clients</h1>
          <p className="text-gray-600">Manage client accounts and information</p>
        </div>
        <Button>Add Client</Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search clients..."
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
                <th className="p-4">Client ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Contact Person</th>
                <th className="p-4">Email</th>
                <th className="p-4">Products</th>
                <th className="p-4">Active Tickets</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((client) => (
                <tr 
                  key={client.id} 
                  className="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4">{client.id}</td>
                  <td className="p-4 font-medium">{client.name}</td>
                  <td className="p-4">{client.contactPerson}</td>
                  <td className="p-4">{client.email}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {client.products.map((product) => (
                        <span 
                          key={product}
                          className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">{client.activeTickets}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {client.status}
                    </span>
                  </td>
                  <td className="p-4">{client.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
