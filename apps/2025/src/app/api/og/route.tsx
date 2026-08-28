import { SITE_METADATA_2025 } from '@portfolio/content/data2025'
import { clampOgText, OG_DESCRIPTION_MAX, OG_TITLE_MAX } from '@portfolio/utils'
import { renderOg2025 } from '@/og/render-og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fallback = SITE_METADATA_2025.headerTitle.en
  const title = clampOgText(searchParams.get('title'), OG_TITLE_MAX) || fallback
  const description = clampOgText(searchParams.get('description'), OG_DESCRIPTION_MAX)
  const image = renderOg2025({ title, description: description || undefined })
  image.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
  return image
}
