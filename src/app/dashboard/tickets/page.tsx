'use client'
import type { Ticket } from '@/constants/tickets'
import type { TableColumn } from '@/types/interfaces/Props'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { SearchIcon, FilterIcon } from '@/components/icons/ActionIcons'
import { ticketService } from '@/services/tickets.service'
import { FilterModalTickets } from '@/components/tickets/FilterModalTickets'
import {
  TICKET_STATUS_OPTIONS,
  TICKET_PRIORITY_OPTIONS,
} from '@/constants/ticketconfig'
import CreateTicketModal from '@/components/tickets/CreateTicketModal'
import { Table } from '@/components/ui/Table'
import { createTicketsTableColumns } from './ticketsTable'

interface Filters {
  status: { label: string; value: string | number }
  priority: { label: string; value: string | number }
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    status: TICKET_STATUS_OPTIONS[0],
    priority: TICKET_PRIORITY_OPTIONS[0],
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleEdit = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedTicket) return
    try {
      await ticketService.deleteTicket(selectedTicket.id)
      setIsDeleteModalOpen(false)
      setSelectedTicket(null)
      await handleRefresh()
    } catch (error) {
      console.error('Error deleting ticket:', error)
    }
  }

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getUserTickets()

        const mappedTickets: Ticket[] = data.map((ticket: Ticket) => ({
          id: ticket.id,
          ticketCode: ticket.ticketCode,
          title: ticket.title,
          client: ticket.client
            ? { companyName: ticket.client.companyName }
            : null,
          product: ticket.product
            ? {
                name: ticket.product.name,
                status: ticket.product.status,
                updatedAt: ticket.product.updatedAt,
              }
            : null,
          status: ticket.status,
          priority: ticket.priority,
          assignee: ticket.assignee,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
        }))
        setTickets(mappedTickets)
      } catch (error) {
        console.error('Error fetching tickets:', error)
        setTickets([])
      }
    }
    fetchTickets()
  }, [])

  const filteredTickets = tickets.filter((ticket) => {
    const clientName = ticket.client?.companyName || ''
    const productName = ticket.product?.name || ''

    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      selectedStatus === 'all' || ticket.status === selectedStatus

    const matchesPriority =
      selectedPriority === 'all' || ticket.priority === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleFilterApply = (newFilters: Filters) => {
    setFilters(newFilters)
    setSelectedStatus(newFilters.status.value as string)
    setSelectedPriority(newFilters.priority.value as string)
  }

  const handleRefresh = async () => {
    try {
      const data = await ticketService.getUserTickets()
      const mappedTickets: Ticket[] = data.map((ticket: Ticket) => ({
        id: ticket.id,
        ticketCode: ticket.ticketCode,
        title: ticket.title,
        client: ticket.client
          ? { companyName: ticket.client.companyName }
          : null,
        product: ticket.product
          ? {
              name: ticket.product.name,
              status: ticket.product.status,
              updatedAt: ticket.product.updatedAt,
            }
          : null,
        status: ticket.status,
        priority: ticket.priority,
        assignee: ticket.assignee,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      }))
      setTickets(mappedTickets)
      setSearchTerm('')
      setSelectedTickets([])
      setSelectedStatus('all')
      setSelectedPriority('all')
    } catch (error) {
      console.error('Error refreshing tickets:', error)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(filteredTickets.map((ticket) => ticket.id))
    } else {
      setSelectedTickets([])
    }
  }

  const handleSelectTicket = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets((prev) => [...prev, ticketId])
    } else {
      setSelectedTickets((prev) => prev.filter((id) => id !== ticketId))
    }
  }

  const handleRowClick = (ticket: Ticket) => {
    console.log('Row clicked:', ticket)
  }

  const ticketsTableColumns = createTicketsTableColumns({
    handleEdit,
    handleDeleteClick,
  })

  const enhancedColumns: TableColumn<Ticket>[] = [
    {
      header: (
        <input
          type="checkbox"
          checked={
            filteredTickets.length > 0 &&
            selectedTickets.length === filteredTickets.length
          }
          ref={(input) => {
            if (input) {
              input.indeterminate =
                selectedTickets.length > 0 &&
                selectedTickets.length < filteredTickets.length
            }
          }}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          aria-label="Select all tickets"
        />
      ),
      accessor: (ticket: Ticket) => (
        <input
          type="checkbox"
          checked={selectedTickets.includes(ticket.id)}
          onChange={(e) => handleSelectTicket(ticket.id, e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      className: 'w-12',
    },
    ...ticketsTableColumns,
  ]

  return (
    <>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Tickets</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage and track all support tickets
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Ticket
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex flex-wrap items-center gap-1">
            <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg">
              All Tickets
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              My Tickets
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              Unassigned
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FilterIcon className="w-4 h-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </Button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg mb-6 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              All Tickets
            </h2>
            <p className="text-gray-500 text-sm">
              View and manage all support tickets across products
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="flex-1 relative w-full sm:w-auto">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="assigned">Assigned</option>
              <option value="awaiting_client">Awaiting Client</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="border border-gray-200 rounded-lg">
            <Table
              data={filteredTickets}
              columns={enhancedColumns}
              onRowClick={handleRowClick}
              emptyState={
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-2">No tickets found</p>
                  <p className="text-gray-400 text-sm">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </div>

      <FilterModalTickets
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleFilterApply}
        initialFilters={filters}
      />

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {isEditModalOpen && selectedTicket && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.40)' }}
        >
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Ticket</h2>
            <p>Editing ticket: {selectedTicket.title}</p>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                onClick={() => setIsEditModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={() => setIsEditModalOpen(false)}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedTicket && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.40)' }}
        >
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Delete Ticket</h2>
            <p>
              Are you sure you want to delete ticket: {selectedTicket.title}?
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}