import { Banner } from 'web-2025'

// Chuỗi banner KHÔNG chứa '__' → nhánh Credit (Photo by @author on Unsplash)
// không render — đúng hành vi khi banner không phải ảnh Unsplash có credit.
// Không thể ghép '__author__id' vào data-URI vì cả chuỗi được dùng làm src ảnh.
const banner =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1e3a8a"/><stop offset="0.5" stop-color="#0ea5e9"/><stop offset="1" stop-color="#14b8a6"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/></svg>`
  )

export const ArticleBanner = () => (
  <div style={{ maxWidth: 760 }}>
    <Banner banner={banner} />
  </div>
)
