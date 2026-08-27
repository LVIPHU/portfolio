import type { MetadataRoute } from 'next'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_METADATA.title.en,
    short_name: SITE_METADATA.author ?? 'LVP',
    description: SITE_METADATA.description.en.replace('sofware', 'software'),
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/static/images/logo/dark.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/static/images/logo/light.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
