import { api } from '@/lib/api-client'
import type { Product, ProductFilters, CreateProductDto, UpdateProductDto } from '../types/product.types'

/**
 * Products API Service
 * 
 * API Documentation: https://fakeapi.platzi.com/en/rest/swagger
 */
export const productsApi = {
  /**
   * Get Products List
   * 
   * Supports filtering, pagination, and search:
   * - title: search by product title (partial match)
   * - categoryId: filter by category
   * - price_min, price_max: price range filter
   * - limit: results per page (default: 10)
   * - offset: pagination offset (default: 0)
   * 
   * @example
   * // Get first 10 products
   * await productsApi.getProducts({ limit: 10, offset: 0 })
   * 
   * // Search by title
   * await productsApi.getProducts({ title: 'shirt' })
   * 
   * // Filter by category and price
   * await productsApi.getProducts({ 
   *   categoryId: 1, 
   *   price_min: 10, 
   *   price_max: 100 
   * })
   */
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams()

    if (filters?.title) {
      params.append('title', filters.title)
    }
    if (filters?.categoryId) {
      params.append('categoryId', filters.categoryId.toString())
    }
    if (filters?.price_min !== undefined) {
      params.append('price_min', filters.price_min.toString())
    }
    if (filters?.price_max !== undefined) {
      params.append('price_max', filters.price_max.toString())
    }
    if (filters?.limit !== undefined) {
      params.append('limit', filters.limit.toString())
    }
    if (filters?.offset !== undefined) {
      params.append('offset', filters.offset.toString())
    }

    const queryString = params.toString()
    const url = queryString ? `/products?${queryString}` : '/products'
    
    const response = await api.get<Product[]>(url)
    return response.data
  },

  /**
   * Get Single Product by ID
   * 
   * @param id - Product ID
   */
  async getProduct(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  },

  /**
   * Create New Product
   * 
   * Required fields:
   * - title: string
   * - price: number
   * - description: string
   * - categoryId: number
   * - images: string[] (URLs)
   * 
   * @example
   * await productsApi.createProduct({
   *   title: 'New Product',
   *   price: 99.99,
   *   description: 'Product description',
   *   categoryId: 1,
   *   images: ['https://example.com/image.jpg']
   * })
   */
  async createProduct(data: CreateProductDto): Promise<Product> {
    const response = await api.post<Product>('/products', data)
    return response.data
  },

  /**
   * Update Existing Product
   * 
   * Supports partial updates - only send fields you want to change.
   * 
   * @param id - Product ID
   * @param data - Fields to update
   * 
   * @example
   * // Update only title and price
   * await productsApi.updateProduct(123, {
   *   title: 'Updated Title',
   *   price: 149.99
   * })
   */
  async updateProduct(id: number, data: UpdateProductDto): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, data)
    return response.data
  },

  /**
   * Delete Product
   * 
   * @param id - Product ID
   * @returns true if successful
   */
  async deleteProduct(id: number): Promise<boolean> {
    const response = await api.delete<boolean>(`/products/${id}`)
    return response.data
  },
}

