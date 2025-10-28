import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/Button'
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder'
import { formatPrice } from '@/shared/utils/format'
import { DeleteProductDialog } from './DeleteProductDialog'
import { ProductCard } from './ProductCard'
import type { Product } from '../types/product.types'

/**
 * Sort direction type
 */
export type SortDirection = 'asc' | 'desc' | null

/**
 * Sortable columns
 */
export type SortableColumn = 'title' | 'price' | 'category'

interface ProductTableProps {
  products: Product[]
  sortColumn?: SortableColumn | null
  sortDirection?: SortDirection
  onSortChange?: (column: SortableColumn | null, direction: SortDirection) => void
}


export function ProductTable({
  products,
  sortColumn = null,
  sortDirection = null,
  onSortChange,
}: ProductTableProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  // Handle column header click
  const handleSort = (column: SortableColumn) => {
    if (!onSortChange) return
    
    if (sortColumn === column) {
      // Cycling: asc → desc → null
      if (sortDirection === 'asc') {
        onSortChange(column, 'desc')
      } else if (sortDirection === 'desc') {
        onSortChange(null, null)
      }
    } else {
      onSortChange(column, 'asc')
    }
  }

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0

    let aValue: string | number
    let bValue: string | number

    switch (sortColumn) {
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case 'price':
        aValue = a.price
        bValue = b.price
        break
      case 'category':
        aValue = a.category.name.toLowerCase()
        bValue = b.category.name.toLowerCase()
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Sort indicator icon
  const SortIcon = ({ column }: { column: SortableColumn }) => {
    if (sortColumn !== column) {
      return (
        <svg
          className="ml-1 inline h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      )
    }

    return sortDirection === 'asc' ? (
      <svg
        className="ml-1 inline h-4 w-4 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="ml-1 inline h-4 w-4 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    )
  }

  // Empty state
  if (sortedProducts.length === 0) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your filters or search term
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile View - Cards Grid (< 768px) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Desktop View - Table (>= 768px) */}
      <div className="hidden md:block overflow-hidden rounded-lg bg-slate-900/50 border border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-slate-800">
            <thead className="bg-slate-900/70 backdrop-blur-sm">
              <tr>
                <th
                  scope="col"
                  className="w-20 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                >
                  Image
                </th>
                <th
                  scope="col"
                  className="w-[40%] cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400 hover:text-indigo-400 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  Product <SortIcon column="title" />
                </th>
                <th
                  scope="col"
                  className="w-28 cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400 hover:text-indigo-400 transition-colors"
                  onClick={() => handleSort('price')}
                >
                  Price <SortIcon column="price" />
                </th>
                <th
                  scope="col"
                  className="w-36 cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400 hover:text-indigo-400 transition-colors"
                  onClick={() => handleSort('category')}
                >
                  Category <SortIcon column="category" />
                </th>
                <th
                  scope="col"
                  className="w-48 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/30">
              {sortedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-800/50 transition-colors">
                  {/* Image */}
                  <td className="px-6 py-4">
                    {!imageErrors[product.id] && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="h-12 w-12 rounded object-cover"
                        onError={() => setImageErrors(prev => ({ ...prev, [product.id]: true }))}
                      />
                    ) : (
                      <ImagePlaceholder className="h-12 w-12 rounded" />
                    )}
                  </td>

                  {/* Title & Description */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-100 truncate">{product.title}</div>
                    <div className="text-sm text-slate-400 line-clamp-2">
                      {product.description}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      {formatPrice(product.price)}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-1 text-xs font-semibold text-indigo-300">
                      {product.category.name}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link to={`/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link to={`/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <DeleteProductDialog
                        productId={product.id}
                        productTitle={product.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

