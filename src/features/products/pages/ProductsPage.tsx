import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/shared/components/ui/Button'
import { useProducts } from '../hooks/useProducts'
import { ProductFilters } from '../components/ProductFilters'
import { ProductTable, type SortableColumn, type SortDirection } from '../components/ProductTable'
import { ProductTableSkeleton } from '../components/ProductTableSkeleton'
import { Pagination } from '../components/Pagination'

/**
 * ProductsPage Component
 * 
 * Main page with products list.
 * 
 * Features:
 * - Filtering (title, category, price range)
 * - Pagination
 * - Global sorting (persists in URL, sorts ALL products)
 * - URL state persistence
 * - Loading states
 * - Error handling
 * - Empty states
 * 
 * Smart Fetching Strategy:
 * - ✅ Filters (title, category): Server-side (fast!)
 * - ❌ Price filters: Client-side (API has bugs with price_min/price_max)
 * - ❌ Sorting: Client-side (API doesn't support sorting)
 * - ✅ Only Pagination: Server-side (fast, efficient)
 * 
 * When filters/sorting active → Fetch ALL products → client-side operations
 * 
 * Data Flow:
 * 1. URL params → filters + sorting + pagination state
 * 2. Determine strategy (fetch all vs paginated)
 * 3. useProducts hook → API call (with 10s cache)
 * 4. If fetch all: client-side sorting + pagination
 * 5. Data → ProductTable
 * 6. User interaction → Update URL → Re-fetch (if cache expired)
 */
export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  
  // Sorting state from URL
  const sortBy = (searchParams.get('sortBy') as SortableColumn | null) || null
  const sortDir = (searchParams.get('sortDir') as SortDirection) || null
  
  // Check if we have active sorting or price filtering
  const hasSorting = !!(sortBy && sortDir)
  const hasPriceFilter = !!(searchParams.get('price_min') || searchParams.get('price_max'))
  
  // Smart Fetching Strategy:
  // - ✅ Filters (title, category) → Server-side
  // - ❌ Price filters → Client-side (API has bugs with price_min/price_max)
  // - ❌ Sorting → Client-side (API doesn't support sorting)
  // - ✅ Pagination without filters/sorting → Server-side
  const shouldFetchAll = hasSorting || hasPriceFilter
  
  const filters = {
    title: searchParams.get('title') || undefined,
    categoryId: searchParams.get('categoryId')
      ? parseInt(searchParams.get('categoryId')!, 10)
      : undefined,
    // Don't send price filters to API (it has bugs)
    // We'll filter client-side instead
    limit: shouldFetchAll ? undefined : limit + 1,
    offset: shouldFetchAll ? undefined : (page - 1) * limit,
  }

  // Fetch products with filters
  const { data: allProductsResponse, isLoading, error, isError } = useProducts(filters)
  
  // Client-side filtering, sorting, and pagination
  let processedProducts = allProductsResponse || []
  
  // If fetching all products, do client-side operations
  if (shouldFetchAll && allProductsResponse) {
    // 1. Price filtering (if active) - API has bugs with price_min/price_max
    if (hasPriceFilter) {
      const priceMin = searchParams.get('price_min') ? parseFloat(searchParams.get('price_min')!) : 0
      const priceMax = searchParams.get('price_max') ? parseFloat(searchParams.get('price_max')!) : Infinity
      
      processedProducts = processedProducts.filter(product => 
        product.price >= priceMin && product.price <= priceMax
      )
    }
    
    // 2. Sorting (if active)
    if (sortBy && sortDir) {
      processedProducts = [...processedProducts].sort((a, b) => {
        let aValue: string | number
        let bValue: string | number

        switch (sortBy) {
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

        if (aValue < bValue) return sortDir === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }
    
    // 3. Pagination (client-side)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    processedProducts = processedProducts.slice(startIndex, endIndex)
  }
  
  // Check if there's a next page
  const hasNextPage = shouldFetchAll
    ? !!(allProductsResponse && allProductsResponse.length > page * limit)
    : !!(allProductsResponse && allProductsResponse.length > limit)
  
  // Display products
  const products = shouldFetchAll 
    ? processedProducts
    : (allProductsResponse && hasNextPage 
        ? allProductsResponse.slice(0, limit) 
        : allProductsResponse || [])
    
  // Handle sorting change
  const handleSortChange = (column: SortableColumn | null, direction: SortDirection) => {
    const params = new URLSearchParams(searchParams)
    
    if (column && direction) {
      params.set('sortBy', column)
      params.set('sortDir', direction)
    } else {
      params.delete('sortBy')
      params.delete('sortDir')
    }
    
    setSearchParams(params, { replace: true })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Browse and manage your product inventory
          </p>
        </div>
        <Link to="/products/new">
          <Button>
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <ProductFilters />
      
      {/* Smart Fetching Info - when fetching all products */}
      {shouldFetchAll && (
        <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-indigo-300">
                {hasSorting && hasPriceFilter
                  ? 'Global sorting + price filtering active'
                  : hasSorting
                  ? 'Global sorting active'
                  : 'Price filtering active'}
              </p>
              <p className="text-xs text-indigo-400 mt-0.5">
                {hasPriceFilter && hasSorting
                  ? `Filtered ${processedProducts.length} products, sorted by ${sortBy} (${sortDir})`
                  : hasPriceFilter
                  ? `Showing ${processedProducts.length} products in price range`
                  : `Sorting ${allProductsResponse?.length || 0} products by ${sortBy} (${sortDir})`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-400"
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
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-400">Error loading products</h3>
              <p className="mt-1 text-sm text-red-300">
                {error instanceof Error ? error.message : 'Something went wrong'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <ProductTableSkeleton />}

      {/* Products Table */}
      {!isLoading && products && (
        <>
          <ProductTable 
            products={products}
            sortColumn={sortBy}
            sortDirection={sortDir}
            onSortChange={handleSortChange}
          />
          
          {/* Pagination */}
          <Pagination 
            currentItemsCount={products.length} 
            hasNextPage={hasNextPage}
          />
        </>
      )}

      {/* Stats */}
      {!isLoading && products && products.length > 0 && (
        <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-4">
          <p className="text-sm text-indigo-300">
            Showing <span className="font-semibold text-indigo-200">{products.length}</span> products
            {filters.title && (
              <>
                {' '}
                matching "<span className="font-semibold text-indigo-200">{filters.title}</span>"
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

