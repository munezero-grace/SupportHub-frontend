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
    )
  },
  {
    header: 'Description',
    accessor: (product: Product): ReactNode => (
      <div className="max-w-[200px] text-gray-600 truncate">
        <p className="text-sm text-red-500">
        {product.description}
        </p>
        </div>
    )
  },
  {
    header: 'Clients',
    accessor: (): ReactNode => (
      <div className="flex items-center gap-1">
        <ClientsIcon className="w-4 h-4 text-gray-400" />       
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
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        product.status === 'active' 
          ? 'bg-green-500 text-white' 
          : 'bg-gray-200 text-gray-700'
      }`}>
        {product.status}
      </span>
    )
  }
];
