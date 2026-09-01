import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const updateAuthorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  bio: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional().nullable(),
})
