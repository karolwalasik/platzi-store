import { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/shared/components/ui/Button'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useDeleteProduct } from '../hooks/useProductMutations'

interface DeleteProductDialogProps {
  productId: number
  productTitle: string
  onClose?: () => void
}


export function DeleteProductDialog({
  productId,
  productTitle,
  onClose,
}: DeleteProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: deleteProduct, isPending } = useDeleteProduct()

  const handleDelete = () => {
    deleteProduct(productId, {
      onSuccess: () => {
        toast.success('Product deleted successfully')
        setIsOpen(false)
        onClose?.()
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : 'Failed to delete product')
      },
    })
  }

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={isPending}
      >
        Delete
      </Button>

      {/* Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => !isPending && setIsOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-slate-900 border border-slate-800 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="mt-4 text-center">
              <h3 className="text-lg font-medium text-slate-100">Delete Product</h3>
              <p className="mt-2 text-sm text-slate-400">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-slate-200">"{productTitle}"</span>?
              </p>
              <p className="mt-1 text-sm text-slate-500">
                This action cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

