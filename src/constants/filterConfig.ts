import { Product } from '@/types/interfaces/product';
import { FilterOptions } from '@/types/interfaces/Props';


export const filterProducts = (products: Product[], filters: FilterOptions, searchTerm: string) => {
  return products.filter(product => {
    if (filters.status.value !== 'all' && product.status !== filters.status.value) {
      return false;
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.status.toLowerCase().includes(searchLower)
      )
    }

    return true
  })
}

export const filterFields = [
  {
    label: 'Status',
    name: 'status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  {
    label: 'Support Tier',
    name: 'supportTier',
    type: 'select',
    options: [
      { label: 'Standard', value: 'standard' },
      { label: 'Premium', value: 'premium' },
    ],
  },
]
