import { useState } from 'react';
import { Product } from '@/types/interfaces/product';
import { productService } from '@/services/products.service';



export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    isLoading,
    error,
    fetchProducts
  };
}
