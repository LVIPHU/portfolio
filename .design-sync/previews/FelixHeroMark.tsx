import { FelixHeroMark } from 'web-2025'

// Wordmark blackletter (Cloister Black → SVG path). Rộng full-bleed theo thiết kế hero,
// nên bọc trong khung có bề ngang cố định để card không bị tràn.
const box: React.CSSProperties = { width: 560, maxWidth: '100%' }

export const Wordmark = () => (
  <div style={box}>
    <FelixHeroMark fill='var(--primary)' label='Lương Vĩ Phú' />
  </div>
)

export const OnAmber = () => (
  <div style={{ ...box, background: 'var(--primary)', padding: 20 }}>
    <FelixHeroMark fill='var(--background)' label='Lương Vĩ Phú' />
  </div>
)
