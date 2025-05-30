'use client'

import { useMemo, useState } from 'react'
import { useClientsQuery } from '@/hooks/useQueries'
import ClientListItem from '@/components/clients/ClientListItem'
import { AddClientButton } from '@/components/clients/AddClientButton'
import ClientSearchAndFilters from '@/components/clients/ClientSearchAndFilters'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: clients, isLoading, error } = useClientsQuery()
  const filteredClients = useMemo(
    () =>
      clients?.filter(
        (client) =>
          client.companyName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          // client.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.clientCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      ) ?? [],
    [clients, searchQuery]
  )
  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading clients: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-gray-500">
            Manage client organizations and their product access
          </p>
        </div>
        <div>
          <AddClientButton />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 pb-9">
        <div className="p-4 pb-2">
          <h1 className="text-2xl font-bold">All Clients</h1>
          <p className="text-gray-500">view and manage client organizations</p>
        </div>

        <ClientSearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="mx-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">
                      ID
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">
                      Company Name
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">
                      Contact
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">
                      Products
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">
                      Support Tier
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">
                      Active Tickets
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <ClientListItem key={client.clientCode} client={client} />
                  ))}
                  {filteredClients.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        {searchQuery
                          ? 'No clients found matching your search'
                          : 'No clients found. Add your first client!'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
