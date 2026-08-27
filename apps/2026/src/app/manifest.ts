import type { MetadataRoute } from 'next'
import { profile } from '@portfolio/content'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.name,
    short_name: 'FELIX',
    description: profile.tagline.en,
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#DFB454',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
