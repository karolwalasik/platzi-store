export interface Product {
  id: number
  title: string
  price: number
  description: string
  images: string[]
  creationAt: string
  updatedAt: string
  category: {
    id: number
    name: string
    image: string
  }
}

export interface ProductFilters {
  title?: string
  categoryId?: number
  price_min?: number
  price_max?: number
  limit?: number
  offset?: number
}

export interface CreateProductDto {
  title: string
  price: number
  description: string
  categoryId: number
  images: string[]
}

export interface UpdateProductDto {
  title?: string
  price?: number
  description?: string
  categoryId?: number
  images?: string[]
}

