import { profile } from '@portfolio/content'
import { OG_IMAGE_HEIGHT, OG_IMAGE_TYPE, OG_IMAGE_WIDTH } from '@portfolio/utils'
import { renderOg2026 } from '@/og/render-og'

export const alt = profile.name
export const size = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT }
export const contentType = OG_IMAGE_TYPE

export default async function OpenGraphImage() {
  return renderOg2026({ title: profile.name, description: profile.tagline.en })
}
