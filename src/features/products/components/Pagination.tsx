import { useSearchParams } from 'react-router-dom'
import { Button } from '@/shared/components/ui/Button'

interface PaginationProps {
  currentItemsCount: number
  hasNextPage: boolean
}

/**
 * Pagination Component
 * 
 * Nawigacja między stronami z URL state.
 * 
 * Note: Platzi API nie zwraca total count, więc używamy simplified pagination:
 * - Previous/Next buttons
 * - Nie pokazujemy total pages (bo nie znamy)
 * - hasNextPage sprawdzamy przez fetch z limit+1
 * 
 * Dlaczego URL state dla paginacji?
 * - ✅ User może wrócić do poprzedniej strony browser back button
 * - ✅ Shareable links (link do strony 3)
 * - ✅ Persystuje po refresh
 * 
 * URL param:
 * - page: current page number (1-indexed)
 */
export function Pagination({ currentItemsCount, hasNextPage }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  // Don't show pagination if on first page and no next page
  if (currentPage === 1 && !hasNextPage) {
    return null
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    setSearchParams(params)
  }

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (hasNextPage) {
      goToPage(currentPage + 1)
    }
  }

  return (
    <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/50 px-4 py-3 sm:px-6 rounded-lg">
      {/* Info text */}
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevious}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNext}
          disabled={!hasNextPage}
        >
          Next
        </Button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-300">
            Page <span className="font-medium text-indigo-400">{currentPage}</span> •{' '}
            Showing <span className="font-medium text-indigo-400">{currentItemsCount}</span> products
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            disabled={currentPage === 1}
          >
            ← Previous
          </Button>

          {/* Current page indicator */}
          <span className="px-3 py-1 text-sm font-medium text-slate-300">
            Page {currentPage}
          </span>

          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={!hasNextPage}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  )
}

