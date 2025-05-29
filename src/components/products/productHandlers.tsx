import React from 'react';
import { Product, ProductFormData } from '@/types/interfaces/product';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { TableProps } from '@/types/interfaces/Props';
import { PRODUCT_STATUS_STYLES } from '@/constants/productConfig';
import { UsersIcon } from '@/components/icons/UsersIcon';
import { productService } from '@/services/products.service';
import { ProductHandlerProps } from '@/types/interfaces/productComponents';


export const createProductHandlers = ({
    setSelectedProduct,
    setIsAddModalOpen,
    setIsDeleteModalOpen,
    selectedProduct,
    refreshData
}: ProductHandlerProps) => ({
    handleAddProduct: async (data: ProductFormData) => {
        try {
            if (data.description.trim().length < 10) {
                throw new Error('Description must be at least 10 characters');
            }

            await productService.createProduct(data);
            setIsAddModalOpen(false);
            if (refreshData) await refreshData();
        } catch (error) {
            console.error('Error adding product:', error);
            throw error instanceof Error ? error : new Error('Failed to create product. Please try again.');
        }
    },

    handleEditProduct: async (data: ProductFormData) => {
        try {
            if (!selectedProduct?.id) return;
            await productService.updateProduct(selectedProduct.id, data);
            setIsAddModalOpen(false);
            setSelectedProduct(null);
            if (refreshData) await refreshData();
        } catch (error) {
            console.error('Error editing product:', error);
            throw new Error('Failed to update product. Please try again.');
        }
    },

    handleDeleteProduct: async () => {
        try {
            if (!selectedProduct?.id) {
                throw new Error('No product selected for deletion');
            }
            await productService.deleteProduct(selectedProduct.id);
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
            if (refreshData) {
                await refreshData();
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete product. Please try again.';
            throw new Error(errorMessage);
        }
    },


    getProductColumns: (): TableProps<Product>['columns'] => [
        {
            header: 'ID',
            accessor: 'productCode'
        },
        {
            header: 'Name',
            accessor: 'name'
        },
        {
            header: 'Description',
            accessor: 'description'
        },
        {
            header: 'Active Clients',
            accessor: () => (
                <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4" />
                    <span>100</span>
                </div>
            )
        },
        {
            header: 'Developers',
            accessor: () => (
                <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4" />
                    <span>100</span>
                </div>
            )
        },
        {
            header: 'Active Tickets',
            accessor: () => (
                <div className="flex items-center gap-2">
                    <span>100</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (item: Product) => (
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${PRODUCT_STATUS_STYLES[item.status]}`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: (product: Product) => (
                <ActionMenu
                    items={[
                        {
                            label: 'View Details',

                            onClick: () => {
                            }
                        },
                        {
                            label: 'Edit Product',
                            onClick: () => {
                                setSelectedProduct(product);
                                setIsAddModalOpen(true);
                            }
                        },
                        {
                            label: 'Manage Clients',
                            onClick: () => {
                            }
                        },
                        {
                            label: 'View Tickets',
                            onClick: () => {
                            }
                        },
                        {
                            label: 'Delete',
                            onClick: () => {
                                setSelectedProduct(product);
                                setIsDeleteModalOpen(true);
                            },
                            variant: 'danger'
                        }
                    ]}
                />
            )
        }
    ]
});
