import { api } from '@/lib/api-client'
import type { Category } from '../types/category.types'


export const categoriesApi = {

  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories')
    return response.data
  },

  /**
   * Get Single Category
   * 
   * @param id - Category ID
   */
  async getCategory(id: number): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`)
    return response.data
  },
}

