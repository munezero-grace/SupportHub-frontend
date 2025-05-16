"use client"

import { Button } from '@/components/ui/Button'
import { PlusIcon } from '@/components/icons'
import { products } from '@/constants/products'

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Products</h1>
          <p className="text-gray-600">Manage and monitor BP software products</p>
        </div>
        <Button className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Add Product</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-700">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.status === 'Active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {product.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-lg font-bold text-gray-700">{product.activeClients}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-lg font-bold text-gray-700">{product.openTickets}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">SLA Compliance</p>
                <p className="text-lg font-bold text-green-600">{product.slaCompliance}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-sm text-gray-700">{product.lastUpdated}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
              <Button variant="outline" size="sm">View Details</Button>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
