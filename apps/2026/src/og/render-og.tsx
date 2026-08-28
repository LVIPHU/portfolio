import { ImageResponse } from 'next/og'
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@portfolio/utils'

type Props = {
  title: string
  description?: string
}

type OgFont = {
  name: string
  data: ArrayBuffer
  weight: 700
  style: 'normal'
}

// latin + vietnamese TTF (Satori không đọc woff2). Cùng lý do Panchang trong fonts.ts:
// cmap thiếu Việt → tofu / fallback hệ thống. Fetch một lần / process; lỗi CDN thì vẫn
// render (Satori fallback), không 500 card OG.
const ROBOTO_TTF = [
  'https://cdn.jsdelivr.net/fontsource/fonts/roboto@5.2.6/latin-700-normal.ttf',
  'https://cdn.jsdelivr.net/fontsource/fonts/roboto@5.2.6/vietnamese-700-normal.ttf',
] as const

let robotoPromise: Promise<OgFont[] | undefined> | undefined

function loadRoboto(): Promise<OgFont[] | undefined> {
  robotoPromise ??= (async () => {
    try {
      const buffers = await Promise.all(
        ROBOTO_TTF.map(async (url) => {
          const res = await fetch(url)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.arrayBuffer()
        })
      )
      return buffers.map((data) => ({
        name: 'Roboto',
        data,
        weight: 700 as const,
        style: 'normal' as const,
      }))
    } catch {
      return undefined
    }
  })()
  return robotoPromise
}

/** Card OG 2026 — nền đen, accent gold, kicker FELIX. Không chia sẻ JSX với 2025. */
export async function renderOg2026({ title, description }: Props) {
  const fonts = await loadRoboto()
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
        fontFamily: 'Roboto',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 28,
          letterSpacing: 8,
          textTransform: 'uppercase',
          color: '#EFEFEF',
        }}
      >
        FELIX
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.05,
            color: '#DFB454',
          }}
        >
          {title}
        </div>
        {description ? <div style={{ display: 'flex', fontSize: 28, color: '#B0B0B0' }}>{description}</div> : null}
      </div>
    </div>,
    {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      ...(fonts?.length ? { fonts } : {}),
    }
  )
}
