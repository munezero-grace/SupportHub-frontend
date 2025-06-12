'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { PlusIcon } from '@/components/icons/ActionIcons';
import { ProductFormModal } from '@/components/products/ProductFormModal';
import { Dialog } from '@/components/ui/Dialog';
import { PRODUCT_STATUS_OPTIONS } from '@/constants/productConfig';
import { filterProducts } from '@/constants/filterConfig';
import { Product } from '@/types/interfaces/product';
import { FilterModal } from '@/components/products/FilterModal';
import { createProductHandlers } from '@/components/products/productHandlers';
import ClientSelectionModal from '@/components/clients/ClientSelectionModal';
import { productService } from '@/services/products.service';
import { Client } from '@/types/clients';
import { ClientResponse } from '@/types/clients/clientResponse';
import { FilterOptions } from '@/types/interfaces/Props';
import SearchAndFilters from '@/components/shared/SearchAndFilters';
import { useRouter } from 'next/navigation';

export default function ProductsAdminPage() {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    status: PRODUCT_STATUS_OPTIONS[0],
    minClients: undefined,
    minDevelopers: undefined,
    hasActiveTickets: false,
  } as FilterOptions);

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    if (selectedProduct) {
      const savedClientsKey = `selectedClients_${selectedProduct.id}`;
      if (selectedClients.length > 0) {
        localStorage.setItem(savedClientsKey, JSON.stringify(selectedClients));
      } else {
        localStorage.removeItem(savedClientsKey);
      }
    }
  }, [selectedClients, selectedProduct]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsWithActiveClients = await productService.fetchProductsWithActiveClients();
        setProducts(productsWithActiveClients);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const openClientModal = (product: Product) => {
    setSelectedProduct(product);

    const savedClientsKey = `selectedClients_${product.id}`;
    const savedClients = localStorage.getItem(savedClientsKey);
    if (savedClients) {
      setSelectedClients(JSON.parse(savedClients));
    } else {
      const initialSelectedClients: Client[] = product.clientProducts
        ? product.clientProducts.map((cp) => {
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
            clientProducts: clientData.clientProducts,
          };
        })
        : [];
      setSelectedClients(initialSelectedClients);
    }

    const initialSelectedProductIds = product.clientProducts
      ? product.clientProducts.map((cp) => String((cp as unknown as ClientResponse).id))
      : [];
    setSelectedProductIds(initialSelectedProductIds);
    setIsClientModalOpen(true);
  };

  const { handleAddProduct, handleEditProduct, handleDeleteProduct, getProductColumns } =
    createProductHandlers({
      setSelectedProduct,
      setIsAddModalOpen,
      setIsDeleteModalOpen,
      selectedProduct,
      refreshData: async () => {
        try {
          const productsWithActiveClients = await productService.fetchProductsWithActiveClients();
          setProducts(productsWithActiveClients);
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        }
      },
      openClientModal,
      onNavigate: (path) => router.push(path)
    });

  const handleFilterApply = (newFilters: FilterOptions) => setFilters(newFilters);
  const filteredProducts = filterProducts(products, filters, searchTerm);
  const columns = getProductColumns();

  const handleClientSelect = async (client: Client) => {
    const exists = selectedClients.find((c) => c.id === client.id);
    if (!exists && selectedProduct) {
      await productService.addClientToProduct(String(selectedProduct.id), String(client.id));
      setSelectedClients([...selectedClients, client]);
      setSelectedProductIds([...selectedProductIds, String(client.id)]);
      try {
        const productsWithActiveClients = await productService.fetchProductsWithActiveClients();
        setProducts(productsWithActiveClients);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    }
  };

  const handleClientRemove = async (client: Client) => {
    if (selectedProduct) {
      try {
        await productService.removeClientFromProduct(String(selectedProduct.id), String(client.id));
        setSelectedClients(selectedClients.filter((c) => c.id !== client.id));
        setSelectedProductIds(selectedProductIds.filter((id) => id !== String(client.id)));
        try {
          const productsWithActiveClients = await productService.fetchProductsWithActiveClients();
          setProducts(productsWithActiveClients);
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        }
        setIsClientModalOpen(false);
        setTimeout(() => {
          setIsClientModalOpen(true);
        }, 0);
      } catch (error) {
        console.error("Error removing client from product:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500">Manage software products and assign clients and developers</p>
        </div>
        <div>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedProduct(null);
              setIsAddModalOpen(true);
            }}
            className="!bg-black !text-white rounded-lg flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 pb-9">
        <div className="p-4 pb-2">
          <h2 className="text-2xl font-bold">All Products</h2>
          <p className="text-gray-500">View and manage software products</p>
        </div>

        <SearchAndFilters
          searchQuery={searchTerm}
          onSearchChange={setSearchTerm}
          onFilterClick={() => setFilterModalOpen(true)}
          placeholder="Search products..."
        />

        <div className="mx-4">
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
        title={selectedProduct ? "Edit Product" : "Add Product"}
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
            <Button variant="primary" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>

      <ClientSelectionModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSelectClient={handleClientSelect}
        onRemoveClient={handleClientRemove}
        selectedClientIds={selectedClients.map((c) => String(c.id))}
      />
    </div>
  );
}
