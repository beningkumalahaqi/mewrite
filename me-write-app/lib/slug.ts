import { db } from '@/lib/db'

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

function generateRandomSuffix(): string {
  return Math.random().toString(36).slice(2, 6)
}

export async function generateSlug(title: string | null, date: string): Promise<string> {
  const dateStr = formatDate(date)
  
  let baseSlug: string
  if (title && title.trim()) {
    baseSlug = slugify(title) + '-' + dateStr
  } else {
    baseSlug = 'untitled-' + dateStr + '-' + generateRandomSuffix()
  }

  // Check for collisions
  let slug = baseSlug
  let counter = 1
  
  while (true) {
    const existing = await db.writing.findUnique({
      where: { slug },
      select: { id: true },
    })
    
    if (!existing) break
    
    // If collision, append suffix
    if (title && title.trim()) {
      slug = slugify(title) + '-' + dateStr + '-' + generateRandomSuffix()
    } else {
      slug = 'untitled-' + dateStr + '-' + generateRandomSuffix()
    }
    
    counter++
    if (counter > 10) {
      // Fallback: use cuid-like suffix
      slug = baseSlug + '-' + Date.now().toString(36)
      break
    }
  }

  return slug
}
