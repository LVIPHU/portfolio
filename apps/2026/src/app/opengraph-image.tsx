import { ImageResponse } from 'next/og'
import { profile } from '@portfolio/content'

export const alt = profile.name
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#000',
        color: '#DFB454',
        padding: 72,
        fontFamily: 'Georgia, serif',
      }}
    >
      <div style={{ fontSize: 28, letterSpacing: 8, textTransform: 'uppercase', color: '#EFEFEF' }}>FELIX</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, color: '#DFB454' }}>{profile.name}</div>
        <div style={{ fontSize: 28, color: '#B0B0B0' }}>{profile.tagline.en}</div>
      </div>
    </div>,
    { ...size }
  )
}
