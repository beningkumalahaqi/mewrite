export async function PublicFooter() {
  'use cache'
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <span>MeWrite</span>
      <span>© {year}</span>
    </footer>
  )
}
