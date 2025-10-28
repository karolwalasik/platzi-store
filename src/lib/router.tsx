import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { Spinner } from '@/shared/components/ui/Spinner'

// Lazy loading
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const ProductsPage = lazy(() => import('@/features/products/pages/ProductsPage'))
const CreateProductPage = lazy(() => import('@/features/products/pages/CreateProductPage'))
const EditProductPage = lazy(() => import('@/features/products/pages/EditProductPage'))
const ProductDetailPage = lazy(() => import('@/features/products/pages/ProductDetailPage'))
const NotFoundPage = lazy(() => import('@/shared/pages/NotFoundPage'))

// Wrapper
const withSuspense = (Component: React.ComponentType) => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    }
  >
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: withSuspense(ProductsPage),
      },
      {
        path: 'products/new',
        element: withSuspense(CreateProductPage),
      },
      {
        path: 'products/:id',
        element: withSuspense(ProductDetailPage),
      },
      {
        path: 'products/:id/edit',
        element: withSuspense(EditProductPage),
      },
    ],
  },
  {
    path: '/404',
    element: withSuspense(NotFoundPage),
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
])

