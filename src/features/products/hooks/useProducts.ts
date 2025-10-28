import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../services/products-api'
import type { ProductFilters } from '../types/product.types'

/**
 * useProducts Hook

 * 
 * @param filters - Optional filters (title, category, price range, pagination)
 */
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters || {}],
    queryFn: () => productsApi.getProducts(filters),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * useProduct Hook
 * 
 * Fetches single product by ID.
 * 
 * @param id - Product ID
 * @param enabled - Whether to run query (useful for conditional fetching)
 */
export function useProduct(id: number, enabled = true) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id),
    enabled: enabled && !!id, // Don't fetch if id is 0 or undefined
  })
}

