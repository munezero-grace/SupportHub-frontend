'use client'

import { mockClients } from '@/constants/mockClients'
import ClientListItem from '@/components/clients/ClientListItem'
import AddClientButton from '@/components/clients/AddClientButton'
import ClientSearchAndFilters from '@/components/clients/ClientSearchAndFilters'
import { useState } from 'react'

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [clients] = useState(mockClients)

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddClient = () => {
    alert('Add Client form would open here')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Clients</h1>
          <p className="text-gray-600">
            Manage client organizations and their product access
          </p>
        </div>
        <AddClientButton onClick={handleAddClient} />
      </div>

      <ClientSearchAndFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead >
              <tr className="text-left text-sm font-medium text-gray-500 divide-y divide-gray-200">
                <th className="p-4 ">ID</th>
                <th className="p-4 ">Client Name</th>
                <th className="p-4 ">Contact</th>
                <th className="p-4 ">Products</th>
                <th className="p-4 ">Support Tier</th>
                <th className="p-4 ">Active Tickets</th>
                <th className="p-4 ">Status</th>
                <th className="p-4 ">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <ClientListItem key={client.id} client={client} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
