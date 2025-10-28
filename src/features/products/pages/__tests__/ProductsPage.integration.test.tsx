import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import ProductsPage from '../ProductsPage'
import { getProducts } from '../../services/products-api'
import { getCategories } from '../../../categories/services/categories-api'

vi.mock('../../services/products-api', () => ({
  getProducts: vi.fn(),
}))

vi.mock('../../../categories/services/categories-api', () => ({
  getCategories: vi.fn(),
}))

const mockProducts = [
  {
    id: 1,
    title: 'Product 1',
    price: 100,
    description: 'Description 1',
    images: ['image1.jpg'],
    category: { id: 1, name: 'Category 1', image: 'cat1.jpg' },
    creationAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 2,
    title: 'Product 2',
    price: 200,
    description: 'Description 2',
    images: ['image2.jpg'],
    category: { id: 2, name: 'Category 2', image: 'cat2.jpg' },
    creationAt: '2024-01-02',
    updatedAt: '2024-01-02',
  },
]

const mockCategories = [
  { id: 1, name: 'Category 1', image: 'cat1.jpg', creationAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 2, name: 'Category 2', image: 'cat2.jpg', creationAt: '2024-01-02', updatedAt: '2024-01-02' },
]

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    )
  }
}

describe('ProductsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getProducts).mockResolvedValue(mockProducts)
    vi.mocked(getCategories).mockResolvedValue(mockCategories)
  })

  it('should display loading state initially', () => {
    render(<ProductsPage />, { wrapper: createWrapper() })
    
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('should show "Create Product" button', async () => {
    render(<ProductsPage />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('New Product')).toBeInTheDocument()
    })
  })
})

