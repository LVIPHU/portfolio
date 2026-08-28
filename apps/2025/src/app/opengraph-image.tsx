import { SITE_METADATA_2025 } from '@portfolio/content/data2025'
import { OG_IMAGE_HEIGHT, OG_IMAGE_TYPE, OG_IMAGE_WIDTH } from '@portfolio/utils'
import { renderOg2025 } from '@/og/render-og'

const title = SITE_METADATA_2025.headerTitle.en

export const alt = title
export const size = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT }
export const contentType = OG_IMAGE_TYPE

export default function OpenGraphImage() {
  return renderOg2025({ title, description: SITE_METADATA_2025.description.en })
}
