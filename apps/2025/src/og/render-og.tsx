import { ImageResponse } from 'next/og'
import { SITE_METADATA_2025 } from '@portfolio/content/data2025'
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@portfolio/utils'

type Props = {
  title: string
  description?: string
}

const KICKER = SITE_METADATA_2025.headerTitle.en

/** Card OG 2025 — nền sáng, accent indigo, kicker headerTitle. Không copy gold/FELIX. */
export function renderOg2025({ title, description }: Props) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#fdfaf6',
        color: '#1f1f1f',
        padding: 64,
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            width: 8,
            height: 40,
            background: '#4f46e5',
            borderRadius: 8,
          }}
        />
        <div style={{ display: 'flex', fontSize: 22, fontWeight: 600, color: '#4f46e5' }}>{KICKER}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.1,
            color: '#1f1f1f',
          }}
        >
          {title}
        </div>
        {description ? (
          <div style={{ display: 'flex', fontSize: 26, color: '#525252', fontWeight: 400 }}>{description}</div>
        ) : null}
      </div>
      <div
        style={{
          display: 'flex',
          height: 8,
          width: 160,
          background: '#6366f1',
          borderRadius: 8,
        }}
      />
    </div>,
    { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT }
  )
}
