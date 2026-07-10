import { Image, Zoom } from 'web-2025'

// Image = shim next/image → <img> thuần trong bundle; wrapper .image-container bo góc +
// căn giữa, có hiệu ứng pulse/blur khi chưa load. Zoom (react-medium-image-zoom) bọc ngoài
// để click phóng to như ảnh trong bài viết.

const cover =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient></defs><rect width="800" height="450" fill="url(#g)"/><circle cx="620" cy="120" r="70" fill="rgba(255,255,255,0.25)"/><circle cx="180" cy="330" r="110" fill="rgba(255,255,255,0.15)"/></svg>`
  )

export const ArticleCover = () => (
  <div style={{ maxWidth: 640 }}>
    <Image src={cover} alt="Ảnh bìa: gradient tím xanh với bố cục hình tròn" width={720} height={405} className="rounded-lg" />
    <p className="text-xs text-muted-foreground mt-2" style={{ textAlign: 'center' }}>
      Ảnh bìa bài &quot;Tối ưu hiệu năng ảnh trong Next.js&quot;
    </p>
  </div>
)

export const ZoomablePortrait = () => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <Zoom>
      <Image
        src="https://avatars.githubusercontent.com/u/84316006?v=4"
        alt="Chân dung Lương Vĩ Phú"
        width={180}
        height={180}
        className="rounded-lg"
      />
    </Zoom>
  </div>
)
