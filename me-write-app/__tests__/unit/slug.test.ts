import { describe, it, expect } from 'vitest'

// Test the slugify function inline since it's not exported
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

describe('Slug Generation', () => {
  describe('slugify', () => {
    it('converts text to lowercase', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('replaces spaces with hyphens', () => {
      expect(slugify('my writing piece')).toBe('my-writing-piece')
    })

    it('removes non-alphanumeric characters', () => {
      expect(slugify('Hello! @World#')).toBe('hello-world')
    })

    it('collapses multiple hyphens', () => {
      expect(slugify('hello---world')).toBe('hello-world')
    })

    it('trims leading and trailing hyphens', () => {
      expect(slugify('-hello-')).toBe('hello')
    })

    it('truncates to 100 characters', () => {
      const longText = 'a'.repeat(150)
      expect(slugify(longText).length).toBe(100)
    })

    it('handles empty string', () => {
      expect(slugify('')).toBe('')
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      expect(formatDate('2026-09-01')).toBe('2026-09-01')
    })

    it('handles single digit months and days', () => {
      expect(formatDate('2026-01-05')).toBe('2026-01-05')
    })
  })
})
