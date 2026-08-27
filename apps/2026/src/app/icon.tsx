import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        color: '#DFB454',
        fontSize: 22,
        fontWeight: 700,
        fontFamily: 'Georgia, serif',
      }}
    >
      F
    </div>,
    { ...size }
  )
}
