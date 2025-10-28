import toast from 'react-hot-toast'
import { ProductForm } from '../components/ProductForm'
import { useCreateProduct } from '../hooks/useProductMutations'
import type { ProductFormData } from '../types/product.schema'


export default function CreateProductPage() {
  const { mutate: createProduct, isPending, error } = useCreateProduct()

  const handleSubmit = (data: ProductFormData) => {
    createProduct(data, {
      onSuccess: () => {
        toast.success('Product created successfully!')
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : 'Failed to create product')
      },
    })
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Create New Product
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Add a new product to your inventory
        </p>
      </div>

      {/* Global error */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
          <p className="text-sm text-red-400">
            {error instanceof Error ? error.message : 'Failed to create product'}
          </p>
        </div>
      )}

      {/* Form */}
      <div className="rounded-lg bg-slate-900/50 border border-slate-800 p-6 shadow-xl">
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="Create Product"
        />
      </div>
    </div>
  )
}

