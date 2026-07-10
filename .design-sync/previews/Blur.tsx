import { Blur } from 'web-2025'

// Blur là overlay `fixed bottom-0` với backdrop-blur — trong app phủ mép dưới trang Photos.
// Wrapper có transform:translateZ(0) để trở thành containing block cho position:fixed,
// vì vậy dải blur nằm ở đáy khung preview thay vì đáy viewport.

const tile = (from: string, to: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/></svg>`
  )

const photos = [
  tile('#f59e0b', '#ef4444'),
  tile('#0ea5e9', '#6366f1'),
  tile('#10b981', '#0ea5e9'),
  tile('#8b5cf6', '#ec4899'),
  tile('#f43f5e', '#f59e0b'),
  tile('#14b8a6', '#84cc16'),
]

export const PhotoGridFooterBlur = () => (
  <div
    style={{
      position: 'relative',
      height: 300,
      overflow: 'hidden',
      transform: 'translateZ(0)',
      borderRadius: 8,
      border: '1px solid var(--color-border)',
      background: 'var(--color-background)',
    }}
  >
    <div className='p-4' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {photos.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt={`Ảnh Đà Lạt ${i + 1}`}
          className='rounded-md'
          style={{ width: '100%', height: 110, objectFit: 'cover' }}
        />
      ))}
      <p className='text-muted-foreground text-sm' style={{ gridColumn: '1 / -1' }}>
        Bộ ảnh Đà Lạt 2024 — cuộn xuống để xem thêm. Mép dưới được phủ backdrop-blur.
      </p>
    </div>
    <Blur />
  </div>
)
