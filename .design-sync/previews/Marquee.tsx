import { Marquee } from 'web-2025'

// Dải chữ chạy ngang vô tận (hero trang chủ). Ảnh chụp bắt một khung của animation.
const item: React.CSSProperties = { margin: '0 24px', whiteSpace: 'nowrap' }

export const TechStack = () => (
  <div style={{ width: 620, maxWidth: '100%', overflow: 'hidden' }}>
    <Marquee duration={24}>
      <span className='h3' style={item}>
        TYPESCRIPT<span style={{ color: 'var(--primary)', margin: '0 24px' }}>·</span>
      </span>
      <span className='h3' style={item}>
        NEXT.JS<span style={{ color: 'var(--primary)', margin: '0 24px' }}>·</span>
      </span>
      <span className='h3' style={item}>
        TAILWIND CSS<span style={{ color: 'var(--primary)', margin: '0 24px' }}>·</span>
      </span>
    </Marquee>
  </div>
)

export const Inverted = () => (
  <div style={{ width: 620, maxWidth: '100%', overflow: 'hidden' }}>
    <Marquee duration={18} inverted>
      <span className='h3' style={item}>
        REACT<span style={{ color: 'var(--primary)', margin: '0 24px' }}>·</span>
      </span>
      <span className='h3' style={item}>
        NODE.JS<span style={{ color: 'var(--primary)', margin: '0 24px' }}>·</span>
      </span>
    </Marquee>
  </div>
)
