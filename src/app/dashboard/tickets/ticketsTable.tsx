import { ReactNode } from 'react'

export type Ticket = {
  id: string
  ticketCode?: string
  title: string
  client: string | { name: string }
  product: string | { name: string }
  status: string
  priority: string
  assignee: string
  created: string
  lastUpdated: string
}

type TableColumn = {
  header: string
  accessor: (ticket: Ticket) => ReactNode
  className?: string
}

export const ticketsTableColumns: TableColumn[] = [
  {
    header: 'Ticket Code',
    accessor: (ticket: Ticket): ReactNode => (
      <span>{ticket.ticketCode || ticket.id}</span>
    ),
  },
  {
    header: 'Title',
    accessor: (ticket: Ticket): ReactNode => <span>{ticket.title}</span>,
    className: 'w-[200px] max-w-[200px]',
  },
  {
    header: 'Client',
    accessor: (ticket: Ticket): ReactNode => (
      <span>
        {typeof ticket.client === 'string'
          ? ticket.client
          : ticket.client?.name || ''}
      </span>
    ),
  },
  {
    header: 'Product',
    accessor: (ticket: Ticket): ReactNode => (
      <span>
        {typeof ticket.product === 'string'
          ? ticket.product
          : ticket.product?.name || ''}
      </span>
    ),
  },
  {
    header: 'Status',
    accessor: (ticket: Ticket): ReactNode => {
      const status = ticket.status.toLowerCase()
      const displayStatus =
        status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === 'new'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {displayStatus}
        </span>
      )
    },
  },
  {
    header: 'Priority',
    accessor: (ticket: Ticket): ReactNode => {
      const priority = ticket.priority.toLowerCase()
      const displayPriority =
        priority.charAt(0).toUpperCase() + priority.slice(1)
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            priority === 'high'
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {displayPriority}
        </span>
      )
    },
  },
  {
    header: 'Assignee',
    accessor: (ticket: Ticket): ReactNode => <span>{ticket.assignee}</span>,
  },
  {
    header: 'Created',
    accessor: (ticket: Ticket): ReactNode => <span>{ticket.created}</span>,
  },
  {
    header: 'Last Updated',
    accessor: (ticket: Ticket): ReactNode => (
      <span className="text-gray-500">{ticket.lastUpdated}</span>
    ),
  },
]
