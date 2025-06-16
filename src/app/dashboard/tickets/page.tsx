'use client'
import type { Ticket } from '@/types/interfaces/interface'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { SearchIcon } from '@/components/icons/ActionIcons'
import { ticketService } from '@/services/tickets.service'
import {
  TICKET_STATUS_OPTIONS,
  TICKET_PRIORITY_OPTIONS,
} from '@/constants/ticketconfig'
import { FilterPopup } from '@/components/shared/FilterModal'
import CreateTicketModal from '@/components/tickets/CreateTicketModal'
import { Table } from '@/components/ui/Table'
import { createTicketTableColumns } from "./ticketsTable"

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false)
  const [filterValues, setFilterValues] = useState({
    status: 'all',
    priority: 'all',
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined)

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDelete = async () => {
    if (!selectedTicket) return
    try {
      await ticketService.deleteTicket(selectedTicket.id)
      setIsDeleteModalOpen(false)
      setSelectedTicket(null)

      const data = await ticketService.getUserTickets()
      const mappedTickets: Ticket[] = data.map((ticket: Ticket) => ({
        id: ticket.id,
        ticketCode: ticket.ticketCode,
        title: ticket.title, 
        client: typeof ticket.client === 'object' && ticket.client
          ? {
            id: ticket.client.id,
            companyName: ticket.client.companyName,
            clientCode: ticket.client.clientCode,
            status: ticket.client.status,
            clientProducts: ticket.client.clientProducts
          }
          : ticket.client,
        product: typeof ticket.product === 'object' && ticket.product
          ? {
            id: ticket.product.id,
            name: ticket.product.name
          }
          : ticket.product,
        status: ticket.status,
        priority: ticket.priority,
        description: ticket.description,
        contactName: ticket.contactName,
        contactEmail: ticket.contactEmail,
        contactPhone: ticket.contactPhone,
        created: ticket.created || ticket.createdAt,
        lastUpdated: ticket.lastUpdated,
        tags: ticket.tags,
        dueDate: ticket.dueDate,
        estimatedTime: ticket.estimatedTime,
        assignee: ticket.assignee,
        internalNotes: ticket.internalNotes,
        imageUrl: ticket.imageUrl
      }))
      setTickets(mappedTickets)
    } catch (error) {
      console.error('Error deleting ticket:', error)
    }
  }
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getUserTickets();
        const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        
        setIsAdmin(userRole?.includes('admin') || userRole?.includes('super_admin') || false);
        setCurrentUserId(userId || undefined);
        
        const mappedTickets = data.map((ticket: Record<string, unknown>): Ticket => ({
          id: ticket.id as string,
          title: ticket.title as string,
          description: ticket.description as string | undefined,
          status: ticket.status as string,
          priority: ticket.priority as string,
          ticketCode: ticket.ticketCode as string | undefined,
          client: ticket.client && typeof ticket.client === 'object'
            ? {
              id: (ticket.client as Record<string, unknown>).id as string,
              companyName: (ticket.client as Record<string, unknown>).companyName as string,
              clientCode: (ticket.client as Record<string, unknown>).clientCode as string,
              status: (ticket.client as Record<string, unknown>).status as string,
              clientProducts: (ticket.client as Record<string, unknown>).clientProducts as Array<{
                product: {
                  id: string;
                  name: string;
                }
              }> | undefined,
            }
            : ticket.client as string | undefined,
          product: ticket.product && typeof ticket.product === 'object'
            ? {
              id: (ticket.product as Record<string, unknown>).id as string,
              name: (ticket.product as Record<string, unknown>).name as string,
            }
            : ticket.product as string,
          contactName: ticket.contactName as string | undefined,
          contactEmail: ticket.contactEmail as string | undefined,
          contactPhone: ticket.contactPhone as string | undefined,
          created: String(ticket.createdAt),
          createdAt: String(ticket.createdAt),
          lastUpdated: String(ticket.updatedAt),
          tags: Array.isArray(ticket.tags) ? ticket.tags.map(String) : undefined,
          assignee: ticket.assignee as string | undefined,
          dueDate: ticket.dueDate as string | undefined,
          estimatedTime: ticket.estimatedTime as string | undefined,
          internalNotes: ticket.internalNotes as string | undefined,
          imageUrl: ticket.imageUrl as string | undefined
        }));
        setTickets(mappedTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setTickets([]);
      }
    };
    fetchTickets();
  }, [])

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsEditModalOpen(true);
  };

  const handleDeleteTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDeleteModalOpen(true);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const clientName = typeof ticket.client === 'string' ? ticket.client : ticket.client?.companyName || '';
    const productName = typeof ticket.product === 'string' ? ticket.product : ticket.product?.name || '';

    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      filterValues.status === 'all' || 
      ticket.status.toLowerCase() === filterValues.status.toLowerCase();

    const matchesPriority = 
      filterValues.priority === 'all' || 
      ticket.priority.toLowerCase() === filterValues.priority.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  })

  const handleFilterChange = (name: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleFilterApply = () => {
    setIsFilterPopupOpen(false)
  }

  const handleFilterClose = () => {
    setIsFilterPopupOpen(false)
  }

  const handleRefresh = async () => {
    try {
      const data = await ticketService.getUserTickets();
      setTickets(data);
      setSearchTerm("");
      setFilterValues({
        status: 'all',
        priority: 'all'
      });
    } catch (error) {
      console.error("Error refreshing tickets:", error);
    }
  };

  const enhancedColumns = createTicketTableColumns({ 
    onEdit: handleEditTicket, 
    onDelete: handleDeleteTicket, 
    currentUserId, 
    isAdmin 
  });

  const handleRowClick = (item: Ticket): void => {
    setSelectedTicket(item);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
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

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <div className="flex flex-wrap items-center gap-1">
            <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg">
              {isAdmin ? 'My Tickets' : 'All Tickets'}
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              Unassigned
            </button>
          </div>
        </div>

        <div className="bg-white  p-4 rounded-lg mb-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="flex-1 relative w-full sm:w-auto">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <select
              value={filterValues.status}
              onChange={(e) => setFilterValues(prev => ({ ...prev, status: e.target.value }))}
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
              value={filterValues.priority}
              onChange={(e) => setFilterValues(prev => ({ ...prev, priority: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="px-4 py-2 flex items-center gap-2"
            >
              Refresh
            </Button>
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

      <FilterPopup
        isOpen={isFilterPopupOpen}
        onClose={handleFilterClose}
        onApply={handleFilterApply}
        onChange={handleFilterChange}
        values={filterValues}
        fields={[
          {
            label: 'Status',
            name: 'status',
            type: 'select',
            options: TICKET_STATUS_OPTIONS,
          },
          {
            label: 'Priority',
            name: 'priority',
            type: 'select',
            options: TICKET_PRIORITY_OPTIONS,
          },
        ]}
        title="Filter"
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