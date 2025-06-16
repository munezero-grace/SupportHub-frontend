import { ReactNode } from 'react';
import { ActionMenu } from '@/components/ui/ActionMenu';
import type { Ticket } from '@/types/interfaces/interface';

type TicketHandlers = {
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
  isAdmin?: boolean;
  currentUserId?: string;
};

export const createTicketTableColumns = ({ onEdit, onDelete }: TicketHandlers) => [
  {
    header: 'ID ↑↓',
    accessor: (ticket: Ticket): ReactNode => (
      <span className="block truncate">{ticket.ticketCode || ticket.id}</span>
    ),
    className: 'w-24',
  },
  {
    header: 'Title',
    accessor: (ticket: Ticket): ReactNode => (
      <span className="truncate block" title={ticket.title}>{ticket.title}</span>
    ),
    className: 'w-[180px] min-w-[180px]',
  },
  {
    header: 'Client',
    accessor: (ticket: Ticket): ReactNode => {
      if (typeof ticket.client === 'string') {
        return <span className="text-sm text-gray-600 truncate block" title={ticket.client}>{ticket.client}</span>;
      }

      if (!ticket.client) {
        return <span className="text-sm text-gray-400">N/A</span>;
      }

      return (
        <div className="flex flex-col gap-0.5">
          <span className={`text-sm font-medium truncate ${ticket.client.status === 'active' ? 'text-gray-700' : 'text-gray-500'}`} title={ticket.client.companyName}>
            {ticket.client.companyName}
          </span>
          {ticket.client.clientProducts && ticket.client.clientProducts.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-gray-600 truncate" title={ticket.client.clientProducts[0].product.name}>
                {ticket.client.clientProducts[0].product.name}
              </span>
              {ticket.client.clientProducts.length > 1 && (
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  +{ticket.client.clientProducts.length - 1}
                </span>
              )}
            </div>
          )}
        </div>
      );
    },
    className: 'w-36',
  },
  {
    header: 'Product',
    accessor: (ticket: Ticket): ReactNode => {
      if (ticket.product && typeof ticket.product === 'string') {
        return <span className="text-sm text-gray-600">{ticket.product}</span>;
      }

      if (ticket.product && typeof ticket.product === 'object' && ticket.product.name) {
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-gray-700">
              {ticket.product.name}
            </span>
          </div>
        );
      }

      return <span className="text-sm text-gray-400">No product assigned</span>;
    },
    className: 'w-32',
  },
  {
    header: 'Priority',
    accessor: (ticket: Ticket): ReactNode => {
      const priority = ticket.priority.toLowerCase();
      const displayPriority = priority.charAt(0).toUpperCase() + priority.slice(1);
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priority === 'critical'
            ? 'bg-red-100 text-red-700'
            : priority === 'high'
              ? 'bg-orange-100 text-orange-700'
              : priority === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
          }`}>
          {displayPriority}
        </span>
      );
    },
    className: 'w-24',
  },
  {
    header: 'Tags',
    accessor: (ticket: Ticket): ReactNode => {
      if (!ticket.tags || ticket.tags.length === 0) return <span className="text-sm text-gray-400">-</span>;

      const MAX_VISIBLE_TAGS = 1;
      const visibleTags = ticket.tags.slice(0, MAX_VISIBLE_TAGS);
      const remainingCount = ticket.tags.length - MAX_VISIBLE_TAGS;

      return (
        <div className="flex items-center gap-1 max-w-full flex-wrap">
          {visibleTags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 truncate max-w-[80px]"
              title={tag}
            >
              {tag}
            </span>
          ))}
          {remainingCount > 0 && (
            <span
              className="text-xs font-medium text-gray-500 whitespace-nowrap"
              title={ticket.tags.slice(MAX_VISIBLE_TAGS).join(', ')}
            >
              +{remainingCount} more
            </span>
          )}
        </div>
      );
    },
    className: 'w-28',
  },
  {
    header: 'Due Date',
    accessor: (ticket: Ticket): ReactNode => (
      <span className="text-sm text-gray-600">
        {ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }) : '-'}
      </span>
    ),
    className: 'w-24',
  },
  {
    header: 'Actions',
    accessor: (ticket: Ticket): ReactNode => (
      <div className="flex justify-end px-2">
        <ActionMenu
          items={[
            {
              label: 'View Details',
              onClick: () => onEdit(ticket),
            },
            {
              label: 'Edit Ticket',
              onClick: () => onEdit(ticket),
            },
            {
              label: 'Delete',
              onClick: () => onDelete(ticket),
              variant: 'danger',
            },
          ]}
        />
      </div>
    ),
    className: 'w-[80px]',
  },
];