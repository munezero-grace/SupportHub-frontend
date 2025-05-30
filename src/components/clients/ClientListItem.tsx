"use client";

import { Client } from '@/types/clients'
import ActionMenu from './ActionMenu'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { Badge } from '@/components/ui/Badge'
import { FC } from 'react'

interface ClientListItemProps {
  client: Client
  
}

const ClientListItem: FC<ClientListItemProps> = ({ client }: ClientListItemProps) =>{
  return (
    <tr className="text-sm font-medium text-black hover:bg-gray-50">
      <td className="p-4">{client.clientCode}</td>
      <td className="p-4">
        <div className="flex items-center">
          <UserCircleIcon className="h-6 w-6 text-gray-500 mr-2" />
          {client.companyName}
        </div>
      </td>
      <td className="p-4">
        <div>{client.user.firstName}</div>
        <div className="text-gray-500">{client.user.email}</div>
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {100}
        </div>
      </td>
      <td className="p-4">
        <Badge
          variant={client.supportTier === 'premium' ? 'warning' : 'default'}
        >
          {client.supportTier}
        </Badge>
      </td>
      <td className="p-4">{100}</td>
      <td className="p-4">
        <Badge variant={client.status === 'active' ? 'success' : 'default'}>
          {client.status}
        </Badge>
      </td>
      <td className="p-4">
        <ActionMenu
          items={[
            {
              label: 'View Details',
              onClick: () =>
                console.log('Viewing details for:', client.clientCode),
            },
            {
              label: 'Edit Client',
              onClick: () => console.log('Editing client:', client.clientCode),
            },
            {
              label: 'Manage Products',
              onClick: () =>
                console.log('Managing products for:', client.clientCode),
            },
            {
              label: 'View Tickets',
              onClick: () =>
                console.log('Viewing tickets for:', client.clientCode),
            },
          ]}
        />
      </td>
    </tr>
  )
}

export default ClientListItem;
