import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { WritingEditor } from '@/components/editor/editor'

interface EditWritingPageProps {
  params: Promise<{ id: string }>
}

export default async function EditWritingPage({ params }: EditWritingPageProps) {
  const { id } = await params

  const writing = await db.writing.findUnique({
    where: { id },
  })

  if (!writing) {
    notFound()
  }

  return (
    <main>
      <WritingEditor
        writingId={writing.id}
        initialData={{
          title: writing.title || undefined,
          date: writing.date.toISOString().slice(0, 10),
          content: writing.content as object,
        }}
      />
    </main>
  )
}
