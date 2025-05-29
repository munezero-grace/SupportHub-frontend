import { Client } from '@/types/clients'

interface ClientListItemProps {
  client: Client
}

export default function ClientListItem({ client }: ClientListItemProps) {
  return (

   /*ID*/

    <tr className="text-sm font-medium text-black hover:bg-gray-50 cursor-pointer">
      <td className="p-4 ">{client.id}</td>



        {/*Client Name*/}
      <td className="p-4 ">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-medium">
              {client.name
                .split(' ')
                .map((word) => word[0])
                .join('')}
            </span>
          </div>
          {client.name}
        </div>
      </td>


        {/*Contact*/}
      <td className="p-4 ">
        <div>{client.contact.name}</div>
        <div className="text-gray-500">{client.contact.email}</div>{' '}
      </td>



        {/*Products*/}
      <td className="p-4 ">
        <div className="flex gap-1">
          {client.products.map((product) => (
            <span
              key={product}
              className="px-2 py-1 rounded-full text-xs font-medium text-black bg-gray-100"
            >
              {product}
            </span>
          ))}
        </div>
      </td>



        {/*Support Tier*/}
      <td className="p-4 ">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            client.supportTier === 'Premium'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {client.supportTier}
        </span>
      </td>



        {/*Active Tickets*/}
      <td className="p-4 ">{client.activeTickets}</td>


        {/*Status*/}
      <td className="p-4 ">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            client.status === 'active'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {client.status}
        </span>
      </td>




        {/*Actions*/}
      <td className="p-4">
        <button className="text-black hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </td>
    </tr>
  )
}
