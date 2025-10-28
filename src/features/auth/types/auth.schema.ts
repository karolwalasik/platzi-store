import { z } from 'zod'

/**
 * Login Form Validation Schema
 * 
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(4, 'Password must be at least 4 characters')
    .max(100, 'Password is too long'),
})

/**
 * TypeScript type inferred from Zod schema
 */
export type LoginFormData = z.infer<typeof loginSchema>

