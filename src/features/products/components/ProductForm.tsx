import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Select } from '@/shared/components/ui/Select'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { productSchema, type ProductFormData } from '../types/product.schema'

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>
  onSubmit: (data: ProductFormData) => void
  isLoading?: boolean
  submitLabel?: string
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save Product',
}: ProductFormProps) {
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      title: '',
      price: 0,
      description: '',
      categoryId: 0,
      images: [''],
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields, append, remove } = useFieldArray<any>({
    control,
    name: 'images',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Product Title <span className="text-red-400">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g. Modern Desk Lamp"
          {...register('title')}
          error={errors.title?.message}
          disabled={isLoading}
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">
          Price (USD) <span className="text-red-400">*</span>
        </Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('price', { valueAsNumber: true })}
          error={errors.price?.message}
          disabled={isLoading}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-red-400">*</span>
        </Label>
        <textarea
          id="description"
          rows={4}
          placeholder="Detailed product description..."
          {...register('description')}
          disabled={isLoading}
          className="flex w-full rounded-md border-2 border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 ring-offset-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        />
        {errors.description && (
          <p className="text-sm text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="categoryId">
          Category <span className="text-red-400">*</span>
        </Label>
        {categoriesLoading ? (
          <div className="flex items-center justify-center py-4">
            <Spinner />
          </div>
        ) : (
          <Select
            id="categoryId"
            {...register('categoryId', { valueAsNumber: true })}
            error={errors.categoryId?.message}
            disabled={isLoading}
          >
            <option value="">Select a category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        )}
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>
          Images (URLs) <span className="text-red-400">*</span>
        </Label>
        <p className="text-sm text-slate-400">Add 1-5 image URLs</p>

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                {...register(`images.${index}` as const)}
                disabled={isLoading}
              />
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={isLoading}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        {fields.length < 5 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append('')}
            disabled={isLoading}
          >
            + Add Image URL
          </Button>
        )}

        {errors.images && (
          <p className="text-sm text-red-400">{errors.images.message}</p>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4 border-t border-slate-800 pt-6">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}
