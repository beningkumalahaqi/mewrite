import { z } from 'zod'

const tiptapDocumentSchema = z.object({
  type: z.literal('doc'),
  content: z.array(z.any()),
})

export const createWritingSchema = z.object({
  title: z.string().max(500).optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date',
  }),
  content: tiptapDocumentSchema,
})

export const updateWritingSchema = createWritingSchema.extend({
  id: z.string().min(1),
})

export const publishWritingSchema = z.object({
  id: z.string().min(1),
})

export const deleteWritingSchema = z.object({
  id: z.string().min(1),
})
