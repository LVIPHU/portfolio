import { ImageResponse } from 'next/og'
import { getAllSlugs, getPost, type Locale } from '@portfolio/content'

export const alt = 'Blog post'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-static'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params
  const post = getPost(slug, locale)
  const title = post?.title ?? slug

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#000',
        padding: 72,
        fontFamily: 'Georgia, serif',
      }}
    >
      <div style={{ fontSize: 24, letterSpacing: 6, textTransform: 'uppercase', color: '#EFEFEF' }}>FELIX · BLOG</div>
      <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1, color: '#DFB454' }}>{title}</div>
    </div>,
    { ...size }
  )
}
