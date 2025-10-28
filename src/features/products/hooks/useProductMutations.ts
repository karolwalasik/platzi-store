import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { productsApi } from '../services/products-api'
import type { CreateProductDto, UpdateProductDto } from '../types/product.types'

export function useCreateProduct() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CreateProductDto) => productsApi.createProduct(data),
    
    onSuccess: () => {
      // Invalidate all products queries (all filter combinations)
      queryClient.invalidateQueries({ queryKey: ['products'] })
      
      // Redirect to products list
      navigate('/', { replace: true })
    },
  })
}


export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductDto }) =>
      productsApi.updateProduct(id, data),
    
    onSuccess: (updatedProduct) => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: ['products'] })
      
      // Update single product cache
      queryClient.setQueryData(['product', updatedProduct.id], updatedProduct)
      
      // Redirect to products list
      navigate('/', { replace: true })
    },
  })
}


export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),
    
    // Optimistic update: usuń od razu z UI
    onMutate: async (productId) => {
      // Cancel ongoing queries aby nie override optimistic update
      await queryClient.cancelQueries({ queryKey: ['products'] })
      
      // Snapshot current state (for rollback)
      const previousProducts = queryClient.getQueryData(['products'])
      
      // Optimistically remove product from all cached queries
      queryClient.setQueriesData(
        { queryKey: ['products'] },
        (old: unknown) => {
          if (!old || !Array.isArray(old)) return old
          return old.filter((p) => p.id !== productId)
        }
      )
      
      // Return context with previous data (for rollback)
      return { previousProducts }
    },
    
    // Rollback on error
    onError: (_err, _productId, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts)
      }
    },
    
    // Always refetch after mutation (success or error)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

