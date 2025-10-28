import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { Button } from '@/shared/components/ui/Button'
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder'
import { formatPrice } from '@/shared/utils/format'
import { DeleteProductDialog } from '../components/DeleteProductDialog'


export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const productId = parseInt(id || '0', 10)

  const { data: product, isLoading, error } = useProduct(productId)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [mainImageError, setMainImageError] = useState(false)
  const [thumbnailErrors, setThumbnailErrors] = useState<Record<number, boolean>>({})

  // Loading state
  if (isLoading) {
    return (
      <div className="animate-pulse">
        {/* Back button skeleton */}
        <div className="mb-6 h-10 w-24 rounded bg-slate-800"></div>

        {/* Content skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Image skeleton */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-lg bg-slate-800"></div>
            <div className="flex gap-2">
              <div className="h-16 w-16 rounded bg-slate-800"></div>
              <div className="h-16 w-16 rounded bg-slate-800"></div>
              <div className="h-16 w-16 rounded bg-slate-800"></div>
            </div>
          </div>

          {/* Details skeleton */}
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-slate-800"></div>
            <div className="h-6 w-1/4 rounded bg-slate-800"></div>
            <div className="h-10 w-32 rounded bg-slate-800"></div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-800"></div>
              <div className="h-4 w-full rounded bg-slate-800"></div>
              <div className="h-4 w-2/3 rounded bg-slate-800"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="rounded-lg bg-slate-900/50 border border-slate-800 p-12 text-center shadow-xl">
        <svg
          className="mx-auto h-12 w-12 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-slate-100">Product not found</h3>
        <p className="mt-2 text-sm text-slate-400">
          {error ? 'Failed to load product details.' : 'This product does not exist.'}
        </p>
        <div className="mt-6">
          <Button onClick={() => navigate('/')}>Back to Products</Button>
        </div>
      </div>
    )
  }

  const selectedImage = product.images[selectedImageIndex] || product.images[0]

  return (
    <div>
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </Button>
      </div>

      {/* Main Content - Mobile-first 2-column layout */}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="overflow-hidden rounded-lg bg-slate-900/50 border border-slate-800 shadow-2xl">
            {!mainImageError && selectedImage ? (
              <img
                src={selectedImage}
                alt={product.title}
                className="aspect-square w-full object-cover"
                onError={() => setMainImageError(true)}
              />
            ) : (
              <ImagePlaceholder className="aspect-square w-full" />
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImageIndex(index)
                    setMainImageError(false)
                  }}
                  className={`shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-indigo-600 ring-2 ring-indigo-500/50'
                      : 'border-slate-700 hover:border-indigo-500/50'
                  }`}
                >
                  {!thumbnailErrors[index] && image ? (
                    <img
                      src={image}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      className="h-16 w-16 object-cover md:h-20 md:w-20"
                      onError={() => setThumbnailErrors(prev => ({ ...prev, [index]: true }))}
                    />
                  ) : (
                    <ImagePlaceholder className="h-16 w-16 md:h-20 md:w-20" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Details */}
        <div className="space-y-6">
          {/* Product Info Card */}
          <div className="rounded-lg bg-slate-900/50 border border-slate-800 p-6 shadow-2xl">
            {/* Category Badge */}
            <span className="inline-flex rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 text-sm font-semibold text-indigo-300">
              {product.category.name}
            </span>

            {/* Title */}
            <h1 className="mt-4 text-2xl font-bold text-slate-100 md:text-3xl">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mt-4 text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent md:text-4xl">
              {formatPrice(product.price)}
            </div>

            {/* Description */}
            <div className="mt-6 border-t border-slate-800 pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Description
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-300">
                {product.description}
              </p>
            </div>

            {/* Product Meta */}
            <div className="mt-6 border-t border-slate-800 pt-6">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-slate-400">Product ID</dt>
                  <dd className="mt-1 text-slate-200">{product.id}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-400">Category ID</dt>
                  <dd className="mt-1 text-slate-200">{product.category.id}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-400">Images</dt>
                  <dd className="mt-1 text-slate-200">{product.images.length}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-400">Created</dt>
                  <dd className="mt-1 text-slate-200">
                    {new Date(product.creationAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Actions Card */}
          <div className="rounded-lg bg-slate-900/50 border border-slate-800 p-6 shadow-2xl">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Actions
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to={`/products/${product.id}/edit`} className="flex-1">
                <Button className="w-full gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Product
                </Button>
              </Link>
              <DeleteProductDialog
                productId={product.id}
                productTitle={product.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
