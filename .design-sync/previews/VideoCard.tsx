import { VideoCard } from 'web-2025'

// Bundle không có mp4/poster thật (/static/videos/... 404) → thẻ <video> render
// TRONG SUỐT; đặt lớp gradient cùng grid-area phía sau (card z-10 đè lên) để thấy
// khung + bóng đổ của card. Cả 2 tile idx=0 để FadeContent không lệch delay lúc capture.
const noop = () => {}

const tile = (from: string, to: string) => ({
  background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
})

// LƯU Ý: KHÔNG dùng padding trên grid container — card abspos với gridRow '1'
// (end line auto) lấy containing block tới MÉP PADDING → card cao hơn row.
// Dùng margin để chừa chỗ cho shadow. Lớp gradient cũng abspos cùng grid-area
// để trùng khít 100% với hộp card (video 404 → trong suốt, gradient lộ ra).
export const HeroVideoGrid = () => (
  <div
    style={{
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gridTemplateRows: '220px',
      gap: 0,
      width: 640,
      margin: '32px auto 110px',
    }}
  >
    <div
      style={{ position: 'absolute', width: '100%', height: '100%', gridColumn: '1 / span 3', gridRow: '1', ...tile('#0ea5e9', '#6366f1') }}
    />
    <div
      style={{ position: 'absolute', width: '100%', height: '100%', gridColumn: '4 / span 3', gridRow: '1', ...tile('#f97316', '#ec4899') }}
    />
    <VideoCard
      idx={0}
      name="video_1"
      href="/projects"
      gridColumn="1 / span 3"
      gridRow="1"
      onPointerEnter={noop}
      onPointerLeave={noop}
      onPointerMove={noop}
    />
    <VideoCard
      idx={0}
      name="video_2"
      href="/blog"
      gridColumn="4 / span 3"
      gridRow="1"
      onPointerEnter={noop}
      onPointerLeave={noop}
      onPointerMove={noop}
    />
  </div>
)
