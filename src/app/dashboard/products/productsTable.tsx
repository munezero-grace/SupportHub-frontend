import { ReactNode } from 'react';
import type { Product } from '@/types/interfaces/product';
import { ProductIcon, ClientsIcon } from '@/components/icons';

type TableColumn = {
  header: string;
  accessor: (product: Product) => ReactNode;
  className?: string;
};

export const productTableColumns: TableColumn[] = [
  {
    header: 'ID',
    accessor: (product: Product): ReactNode => (
      <span>{product.productCode}</span>
    )
  },
  {
    header: 'Product Name',
    accessor: (product: Product): ReactNode => (
      <div className="flex items-center gap-2">
        <ProductIcon className="w-5 h-5 text-gray-500" />
        <span className="font-medium">{product.name}</span>
      </div>
    ),
    className: 'w-[200px] max-w-[200px]'
  },
 {
    header: 'Description',
    accessor: (product: Product): ReactNode => (
      <div className="w-full max-w-xs relative group">
        <p className="text-sm text-gray-600 truncate group-hover:hidden">
          {product.description}
        </p>
        <div className="hidden group-hover:block absolute left-0 top-0 bg-white border border-gray-200 shadow-lg rounded-md p-3 z-50 max-w-sm text-sm text-gray-600 whitespace-normal break-words">
          {product.description}
        </div>
      </div>
    ),
    className: 'w-64 min-w-64 max-w-64'
  },
  {
    header: 'Clients',
    accessor: (product): ReactNode => (
      <div className="flex items-center gap-1">
        <ClientsIcon className="w-4 h-4 text-gray-400" />
        <span>{product.clientProducts ? product.clientProducts.length : 0}</span>
      </div>
    )
  },
  {
    header: 'Developers',
    accessor: (): ReactNode => (
      <div className="flex items-center gap-1">
        <ClientsIcon className="w-4 h-4 text-gray-400" />
        <span>{100}</span>
      </div>
    )
  },
  {
    header: 'Active Tickets',
    accessor: (): ReactNode => (
      <div className="flex items-center gap-1">
        <span>{100}</span>
      </div>
    )
  },
  {
    header: 'Status',
    accessor: (product: Product): ReactNode => (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.status === 'active'
          ? 'bg-green-500/10 text-green-700'
          : 'bg-gray-200 text-gray-700'
        }`}>
        {product.status}
      </span>
    )
  }
];
