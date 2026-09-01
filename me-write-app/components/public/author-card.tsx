import { db } from '@/lib/db'

export async function AuthorCard() {
  const author = await db.author.findFirst()

  if (!author) return null

  return (
    <div className="author-card">
      <div className="author-card__avatar author-card__avatar--placeholder">
        {author.imageUrl ? (
          <img
            src={author.imageUrl}
            alt={author.name}
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          author.name.charAt(0).toUpperCase()
        )}
      </div>
      <div className="author-card__info">
        <div className="author-card__name">{author.name}</div>
        {author.bio && <div className="author-card__bio">{author.bio}</div>}
      </div>
    </div>
  )
}
