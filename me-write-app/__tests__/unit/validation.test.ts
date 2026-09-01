import { describe, it, expect } from 'vitest'
import { createWritingSchema, updateWritingSchema } from '@/lib/validations/writing'

describe('Writing Validation', () => {
  describe('createWritingSchema', () => {
    it('validates valid writing data', () => {
      const data = {
        title: 'Test Title',
        date: '2026-09-01',
        content: { type: 'doc' as const, content: [] },
      }
      expect(() => createWritingSchema.parse(data)).not.toThrow()
    })

    it('allows optional title', () => {
      const data = {
        date: '2026-09-01',
        content: { type: 'doc' as const, content: [] },
      }
      expect(() => createWritingSchema.parse(data)).not.toThrow()
    })

    it('requires date', () => {
      const data = {
        content: { type: 'doc' as const, content: [] },
      }
      expect(() => createWritingSchema.parse(data)).toThrow()
    })

    it('requires content', () => {
      const data = {
        date: '2026-09-01',
      }
      expect(() => createWritingSchema.parse(data)).toThrow()
    })

    it('validates content must be Tiptap doc', () => {
      const data = {
        date: '2026-09-01',
        content: { type: 'paragraph', content: [] },
      }
      expect(() => createWritingSchema.parse(data)).toThrow()
    })

    it('validates invalid date', () => {
      const data = {
        date: 'not-a-date',
        content: { type: 'doc' as const, content: [] },
      }
      expect(() => createWritingSchema.parse(data)).toThrow()
    })
  })

  describe('updateWritingSchema', () => {
    it('requires id', () => {
      const data = {
        date: '2026-09-01',
        content: { type: 'doc' as const, content: [] },
      }
      expect(() => updateWritingSchema.parse(data)).toThrow()
    })

    it('validates with id', () => {
      const data = {
        id: 'test-id',
        date: '2026-09-01',
        content: { type: 'doc' as const, content: [] },
      }
      expect(() => updateWritingSchema.parse(data)).not.toThrow()
    })
  })
})
