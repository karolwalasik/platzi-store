import { z } from 'zod'

/**
 * Product Form Validation Schema
 */
export const productSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title is too long')
    .trim(),
  
  price: z
    .number({ message: 'Price must be a number' })
    .positive('Price must be positive')
    .max(1000000, 'Price is too high'),
  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description is too long')
    .trim(),
  
  categoryId: z
    .number({ message: 'Please select a category' })
    .int('Category must be valid')
    .positive('Category must be valid'),
  
  images: z
    .array(z.string().url('Must be a valid URL'))
    .min(1, 'At least one image is required')
    .max(5, 'Maximum 5 images allowed'),
})

/**
 * TypeScript type inferred from schema
 */
export type ProductFormData = z.infer<typeof productSchema>

