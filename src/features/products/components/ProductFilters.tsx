import { useSearchParams } from 'react-router-dom'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select'
import { Label } from '@/shared/components/ui/Label'
import { Button } from '@/shared/components/ui/Button'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useEffect, useState } from 'react'


export function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  
  const [titleInput, setTitleInput] = useState(searchParams.get('title') || '')
  const [categoryInput, setCategoryInput] = useState(searchParams.get('categoryId') || 'all')
  const [priceMinInput, setPriceMinInput] = useState(searchParams.get('price_min') || '')
  const [priceMaxInput, setPriceMaxInput] = useState(searchParams.get('price_max') || '')
  
  // Debounced search 
  const debouncedTitle = useDebounce(titleInput, 300)

  
  useEffect(() => {
    const currentTitle = searchParams.get('title') || ''
    
    // Only update if title actually changed
    if (currentTitle !== debouncedTitle) {
      const params = new URLSearchParams(searchParams)
      
      if (debouncedTitle) {
        params.set('title', debouncedTitle)
      } else {
        params.delete('title')
      }
      
      // Reset to page 1 only when title changes
      params.set('page', '1')
      
      setSearchParams(params, { replace: true })
    }
  }, [debouncedTitle, setSearchParams, searchParams])

  // Sync local state with URL on mount/URL change (without title)
  useEffect(() => {
    const urlCategory = searchParams.get('categoryId') || 'all'
    const urlPriceMin = searchParams.get('price_min') || ''
    const urlPriceMax = searchParams.get('price_max') || ''
    
    if (urlCategory !== categoryInput) setCategoryInput(urlCategory)
    if (urlPriceMin !== priceMinInput) setPriceMinInput(urlPriceMin)
    if (urlPriceMax !== priceMaxInput) setPriceMaxInput(urlPriceMax)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Apply all filters (except search which is already debounced)
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)
    
    // Category
    if (categoryInput && categoryInput !== 'all') {
      params.set('categoryId', categoryInput)
    } else {
      params.delete('categoryId')
    }
    
    // Price min
    if (priceMinInput) {
      params.set('price_min', priceMinInput)
    } else {
      params.delete('price_min')
    }
    
    // Price max
    if (priceMaxInput) {
      params.set('price_max', priceMaxInput)
    } else {
      params.delete('price_max')
    }
    
    // Reset to page 1
    params.set('page', '1')
    
    setSearchParams(params, { replace: true })
  }

  // Clear all filters
  const clearFilters = () => {
    setTitleInput('')
    setCategoryInput('all')
    setPriceMinInput('')
    setPriceMaxInput('')
    setSearchParams({})
  }

  // Check if any filters are active in URL
  const hasActiveFilters = 
    searchParams.get('title') ||
    searchParams.get('categoryId') ||
    searchParams.get('price_min') ||
    searchParams.get('price_max')
    
  // Check if there are unapplied changes
  const hasUnappliedChanges = 
    categoryInput !== (searchParams.get('categoryId') || 'all') ||
    priceMinInput !== (searchParams.get('price_min') || '') ||
    priceMaxInput !== (searchParams.get('price_max') || '')

  return (
    <div className="rounded-lg bg-slate-900/50 border border-slate-800 p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Filters</h3>
        {hasActiveFilters && (
          <span className="inline-flex items-center rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-300 border border-indigo-500/30">
            {Object.keys(Object.fromEntries(searchParams.entries())).filter(k => 
              ['title', 'categoryId', 'price_min', 'price_max'].includes(k)
            ).length} active
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Filter Inputs Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Title search - auto-apply with debounce */}
          <div className="space-y-2">
            <Label htmlFor="title-search">
              Search
              <span className="ml-1 text-xs text-slate-500">(live)</span>
            </Label>
            <Input
              id="title-search"
              type="text"
              placeholder="Search products..."
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
            />
            {debouncedTitle !== titleInput && (
              <p className="text-xs text-indigo-400 animate-pulse">Searching...</p>
            )}
          </div>

          {/* Category filter */}
          <div className="space-y-2">
            <Label htmlFor="category-filter">Category</Label>
            <Select
              id="category-filter"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              disabled={categoriesLoading}
            >
              <option value="all">All Categories</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Price min */}
          <div className="space-y-2">
            <Label htmlFor="price-min">Min Price</Label>
            <Input
              id="price-min"
              type="number"
              placeholder="0"
              min="0"
              value={priceMinInput}
              onChange={(e) => setPriceMinInput(e.target.value)}
            />
          </div>

          {/* Price max */}
          <div className="space-y-2">
            <Label htmlFor="price-max">Max Price</Label>
            <Input
              id="price-max"
              type="number"
              placeholder="1000"
              min="0"
              value={priceMaxInput}
              onChange={(e) => setPriceMaxInput(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={applyFilters}
            disabled={!hasUnappliedChanges}
            className="gap-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Apply Filters
          </Button>
          
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear All Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

