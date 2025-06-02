"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { PlusIcon, FilterIcon, SearchIcon } from '@/components/icons/ActionIcons';
import { ProductFormModal } from '@/components/products/ProductFormModal';
import { Dialog } from '@/components/ui/Dialog';
import { PRODUCT_STATUS_OPTIONS } from '@/constants/productConfig';
import { filterProducts } from '@/constants/filterConfig';
import { Product } from '@/types/interfaces/product';
import { Input } from '@/components/ui/Input';
import { FilterModal, FilterOptions } from '@/components/products/FilterModal';
import { createProductHandlers } from '@/components/products/productHandlers';
import axiosInstance from '@/services/axiosInstance';
import ClientSelectionModal from '@/components/clients/ClientSelectionModal';
import { productService } from '@/services/products.service';
import { Client } from '@/types/clients';
import { ClientResponse } from '@/types/clients/clientResponse';

export default function ProductsAdminPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    status: PRODUCT_STATUS_OPTIONS[0],
    minClients: undefined,
    minDevelopers: undefined,
    hasActiveTickets: false
  });

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/api/products');
    
      const productsWithActiveClients = response.data.map((product: Product) => ({
        ...product,
        activeClients: product.clientProducts ? product.clientProducts.length : 0,
      }));
      setProducts(productsWithActiveClients);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

const openClientModal = (product: Product) => {
  setSelectedProduct(product);

  const initialSelectedClients: Client[] = product.clientProducts 
    ? product.clientProducts.map(cp => {
        const clientData = cp as unknown as ClientResponse;
        return {
          id: String(clientData.id),
          clientCode: clientData.clientCode,
          name: clientData.name,
          contactName: clientData.contactName,
          companyName: clientData.companyName,
          products: clientData.products,
          supportTier: clientData.supportTier,
          activeTickets: clientData.activeTickets,
          status: clientData.status,
          createdAt: clientData.createdAt,
          updatedAt: clientData.updatedAt,
          user: clientData.user,
          userId: clientData.userId,
          clientProducts: clientData.clientProducts
        };
      })
    : [];
  setSelectedClients(initialSelectedClients);
  setIsClientModalOpen(true);
};

const { handleAddProduct, handleEditProduct, handleDeleteProduct, getProductColumns } = createProductHandlers({
  setSelectedProduct,
  setIsAddModalOpen,
  setIsDeleteModalOpen,
  selectedProduct,
  refreshData: fetchProducts,
  openClientModal
});

  const handleFilterApply = (newFilters: FilterOptions) => setFilters(newFilters);
  
  const filteredProducts = filterProducts(products, filters, searchTerm);
  const columns = getProductColumns();

  const handleClientSelect = async (client: Client) => {
    const exists = selectedClients.find(c => c.id === client.id);
    if (!exists && selectedProduct) {
      await productService.addClientToProduct(String(selectedProduct.id), String(client.id));
      setSelectedClients([...selectedClients, client]);
      await fetchProducts();
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Products</h1>
          <p className="text-gray-600">Manage software products and assign clients and developers</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedProduct(null);
            setIsAddModalOpen(true);
          }}
          className="!bg-black !text-white rounded-lg flex items-center gap-2 w-full md:w-auto"
        >
          <PlusIcon className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 md:p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-700">All Products</h2>
            <p className="text-gray-600">View and Manage Software Products</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2">
              <SearchIcon className="w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              variant="outline"
              onClick={() => setFilterModalOpen(true)}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              <FilterIcon className="w-4 h-4" />
              Filter
            </Button>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-x-auto">
            <Table
              data={filteredProducts}
              columns={columns}
              className="w-full [&_th]:!text-gray-500 [&_td]:!text-gray-900 [&_th]:!font-medium [&_td]:!font-medium [&_th]:!p-4 [&_td]:!p-4 [&_tr]:border-b [&_tr:last-child]:border-b-0"
            />
          </div>
        </div>
      </div>

      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleFilterApply}
        initialFilters={filters}
      />

      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={selectedProduct ? handleEditProduct : handleAddProduct}
        initialData={selectedProduct || undefined}
        title={selectedProduct ? 'Edit Product' : 'Add Product'}
      />

      <Dialog
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        title="Delete Product"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteProduct}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>

      <ClientSelectionModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSelectClient={handleClientSelect}
        selectedClientIds={selectedClients.map(c => String(c.id))}
      />
    </div>
  );
}
