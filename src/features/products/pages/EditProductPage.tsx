import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ProductForm } from '../components/ProductForm'
import { useProduct } from '../hooks/useProducts'
import { useUpdateProduct } from '../hooks/useProductMutations'
import { Spinner } from '@/shared/components/ui/Spinner'
import type { ProductFormData } from '../types/product.schema'


export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const productId = parseInt(id!, 10)

  const { data: product, isLoading: loadingProduct, error: fetchError } = useProduct(productId)
  const { mutate: updateProduct, isPending, error: updateError } = useUpdateProduct()

  const handleSubmit = (data: ProductFormData) => {
    updateProduct(
      { id: productId, data },
      {
        onSuccess: () => {
          toast.success('Product updated successfully!')
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Failed to update product')
        },
      }
    )
  }

  // Loading state
  if (loadingProduct) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Error loading product
  if (fetchError || !product) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-6">
          <h3 className="text-lg font-medium text-red-400">Error</h3>
          <p className="mt-2 text-sm text-red-300">
            {fetchError instanceof Error ? fetchError.message : 'Product not found'}
          </p>
        </div>
      </div>
    )
  }

  // Transform product data for form
  const defaultValues: ProductFormData = {
    title: product.title,
    price: product.price,
    description: product.description,
    categoryId: product.category.id,
    images: product.images,
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Edit Product
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Update product information
        </p>
      </div>

      {/* Error */}
      {updateError && (
        <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
          <p className="text-sm text-red-400">
            {updateError instanceof Error ? updateError.message : 'Failed to update product'}
          </p>
        </div>
      )}

      {/* Form */}
      <div className="rounded-lg bg-slate-900/50 border border-slate-800 p-6 shadow-xl">
        <ProductForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="Update Product"
        />
      </div>
    </div>
  )
}

