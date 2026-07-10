import { ParallaxScroll } from 'web-2025'

// Gallery cột ảnh parallax — render tĩnh (useScroll đứng yên) là đạt.
// LƯU Ý cấu trúc: ImageContainer bên trong LUÔN bọc src qua imageDriveLoader
// (https://drive.google.com/uc?...&id=<src>) nên KHÔNG cách nào truyền data-URI
// tới <img> — ảnh chắc chắn broken ngoài app gốc. Glue CSS bên dưới đóng vai
// trò ảnh minh họa: tô gradient lên .image-container, ẩn <img> hỏng, tắt
// animate-pulse của skeleton. 4 ảnh → chia 2 cột x 2 ảnh (cột 3 rỗng) khớp
// md:grid-cols-2 ở viewport 900px.
const images = [
  { id: 'demo-1', src: 'demo-1' },
  { id: 'demo-2', src: 'demo-2' },
  { id: 'demo-3', src: 'demo-3' },
  { id: 'demo-4', src: 'demo-4' },
]

export const PhotoColumns = () => (
  <>
    <style>{`
.pxs [data-rmiz],.pxs [data-rmiz-content]{display:block;width:100%}
.pxs .image-container{width:100%;height:200px;border-radius:12px;animation:none!important}
.pxs .image-container img{visibility:hidden}
.pxs ul:nth-of-type(1) li:nth-of-type(1) .image-container{background:linear-gradient(135deg,#6366f1,#0ea5e9)}
.pxs ul:nth-of-type(1) li:nth-of-type(2) .image-container{background:linear-gradient(135deg,#f97316,#eab308)}
.pxs ul:nth-of-type(2) li:nth-of-type(1) .image-container{background:linear-gradient(135deg,#22c55e,#14b8a6)}
.pxs ul:nth-of-type(2) li:nth-of-type(2) .image-container{background:linear-gradient(135deg,#ec4899,#8b5cf6)}
`}</style>
    <div className="pxs">
      <ParallaxScroll images={images} />
    </div>
  </>
)
