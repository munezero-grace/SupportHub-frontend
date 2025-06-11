import { ReactNode } from 'react';
import { ProductDisplay } from '@/components/products/ProductDisplay';
import { Ticket } from '@/constants/tickets';
import { ActionMenu } from '@/components/ui/ActionMenu';

export interface TicketTableColumn {
  header: string | ReactNode;
  accessor: (ticket: Ticket) => ReactNode;
  className?: string;
}

interface TicketTableActions {
  handleEdit: (ticket: Ticket) => void;
  handleDeleteClick: (ticket: Ticket) => void;
}

const getStatusStyles = (status: string) => {
  const normalizedStatus = status.toLowerCase().replace('_', ' ');
  switch (normalizedStatus) {
    case 'new':
      return 'bg-blue-100 text-blue-700';
    case 'in progress':
      return 'bg-gray-800 text-white';
    case 'assigned':
      return 'bg-gray-100 text-gray-700';
    case 'awaiting client':
      return 'bg-orange-100 text-orange-700';
    case 'resolved':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getPriorityStyles = (priority: string) => {
  const normalizedPriority = priority.toLowerCase();
  switch (normalizedPriority) {
    case 'critical':
      return 'bg-red-100 text-red-700';
    case 'high':
      return 'bg-red-100 text-red-700';
    case 'medium':
      return 'bg-gray-800 text-white';
    case 'low':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const createTicketsTableColumns = (actions: TicketTableActions): TicketTableColumn[] => [
  {
    header: 'ID ↑↓',
    accessor: (ticket: Ticket): ReactNode => (
      <span className="block truncate">{ticket.ticketCode || ticket.id}</span>
    ),
    className: 'w-32 min-w-32 max-w-32',
  },
  {
    header: 'Title ↑↓',
    accessor: (ticket: Ticket): ReactNode => (
      <span className="block truncate">{ticket.title}</span>
    ),
    className: 'w-[200px] max-w-[200px]',
  },
  {
    header: 'Client',
    accessor: (ticket: Ticket): ReactNode => (
      <span className="block truncate">{ticket.client?.companyName || ''}</span>
    ),
    className: 'w-40 min-w-40 max-w-40',
  },
  {
    header: 'Product',
    accessor: (ticket: Ticket): ReactNode => (
      <ProductDisplay product={ticket.product} />
    ),
    className: 'w-[150px] min-w-[150px] max-w-[150px]',
  },
  {
    header: 'Priority ↑↓',
    accessor: (ticket: Ticket): ReactNode => (
      <span
        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPriorityStyles(
          ticket.priority
        )}`}
      >
        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
      </span>
    ),
    className: 'w-28 min-w-28 max-w-28',
  },
  {
    header: 'Status ↑↓',
    accessor: (ticket: Ticket): ReactNode => (
      <span
        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusStyles(
          ticket.status
        )}`}
      >
        {ticket.status.charAt(0).toUpperCase() +
          ticket.status.slice(1).replace('_', ' ')}
      </span>
    ),
    className: 'w-28 min-w-28 max-w-28',
  },
  {
    header: 'Created ↑↓',
    accessor: (ticket: Ticket): ReactNode => {
      const date = new Date(ticket.createdAt);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      return <span className="block truncate">{formattedDate}</span>;
    },
    className: 'w-32 min-w-32 max-w-32',
  },
  {
    header: 'Actions',
    accessor: (ticket: Ticket) => (
      <ActionMenu
        items={[
          {
            label: 'Edit',
            onClick: () => actions.handleEdit(ticket),
          },
          {
            label: 'Delete',
            onClick: () => actions.handleDeleteClick(ticket),
          },
        ]}
      />
    ),
    className: 'w-20 min-w-20 max-w-20',
  },
];