import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '../services/categories-api'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 mins / categories are not changed frequently
  })
}


export function useCategory(id: number) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesApi.getCategory(id),
    enabled: !!id,
  })
}

