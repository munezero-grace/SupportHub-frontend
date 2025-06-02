'use client'

import { useEffect, useState } from 'react'
import { productService } from '@/services/products.service'
import { Product } from '@/types/interfaces/product'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { use } from 'react'

export default function ProductDetailsPage({ params }: { params: Promise<{ productCode: string }> }) {
    const resolvedParams = use(params)
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProduct(resolvedParams.productCode)
                setProduct(data)
            } catch (error) {
                console.error('Error fetching product:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [resolvedParams.productCode])

    if (loading) {
        return <div className="flex justify-center items-center h-96">Loading...</div>
    }

    if (!product) {
        return <div className="flex justify-center items-center h-96">Product not found</div>
    }

    return (<div className="max-w-[1400px] mx-auto px-1 py-2">
        <div className="flex items-center mb-6 gap-2">          
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard/products')}
                className="flex items-center text-black  hover:text-gray-900"
            >
                <ArrowLeftIcon className="h-4 w-4 gap-6" />
            </Button>
            <h1 className="text-2xl font-bold flex text-gray-900 items-center gap-4">
                Product {product.productCode}
                <span className={`px-2 py-1 text-xs rounded-full font-medium
            ${product.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {product.status}
                </span>
            </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{product.name}</h2>
                <div className="prose max-w-none">
                    <p className="text-gray-600">{product.description}</p>
                </div>
            </div>
        </div>
    </div>
    )
}
