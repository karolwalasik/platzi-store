import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/Button'
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder'
import { formatPrice } from '@/shared/utils/format'
import { DeleteProductDialog } from './DeleteProductDialog'
import type { Product } from '../types/product.types'

interface ProductCardProps {
  product: Product
}


export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 shadow-xl hover:shadow-2xl hover:border-indigo-500/50 transition-all">
      {/* Image & Title Section */}
      <div className="flex gap-4">
        {/* Product Image */}
        <Link to={`/products/${product.id}`} className="shrink-0">
          {!imageError && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-20 w-20 rounded-lg object-cover ring-2 ring-slate-700 hover:ring-indigo-500 transition-all"
              onError={() => setImageError(true)}
            />
          ) : (
            <ImagePlaceholder className="h-20 w-20 rounded-lg ring-2 ring-slate-700" />
          )}
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <Link 
            to={`/products/${product.id}`}
            className="block font-medium text-slate-100 hover:text-indigo-400 transition-colors"
          >
            <h3 className="truncate text-base">{product.title}</h3>
          </Link>

          {/* Category Badge */}
          <span className="mt-1 inline-flex rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-xs font-semibold text-indigo-300">
            {product.category.name}
          </span>

          {/* Price */}
          <div className="mt-2 text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-slate-400 line-clamp-2">
        {product.description}
      </p>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Link to={`/products/${product.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View
          </Button>
        </Link>
        <Link to={`/products/${product.id}/edit`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            Edit
          </Button>
        </Link>
        <DeleteProductDialog
          productId={product.id}
          productTitle={product.title}
        />
      </div>
    </div>
  )
}

