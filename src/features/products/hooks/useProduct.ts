import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../services/products-api'

/**
 * useProduct Hook
 * 
 * 
 * Features:
 * - Caching (10s stale time)
 * - Automatic refetch on window focus
 * - Error handling
 * - Loading states
 * 
 * @param id - Product ID
 * 
 * @example
 * const { data: product, isLoading, error } = useProduct(123)
 */
export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getProduct(id),
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

