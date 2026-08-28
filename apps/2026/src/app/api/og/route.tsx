import { clampOgText, OG_DESCRIPTION_MAX, OG_TITLE_MAX } from '@portfolio/utils'
import { profile } from '@portfolio/content'
import { renderOg2026 } from '@/og/render-og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = clampOgText(searchParams.get('title'), OG_TITLE_MAX) || profile.name
  const description = clampOgText(searchParams.get('description'), OG_DESCRIPTION_MAX)
  const image = await renderOg2026({ title, description: description || undefined })
  image.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
  return image
}
