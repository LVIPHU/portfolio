import { TableOfContents } from 'web-2025'

// TocItem: { value, url, depth } — depth 2 là mức gốc, depth 3 thụt vào 16px.
const toc = [
  { value: 'Giới thiệu', url: '#gioi-thieu', depth: 2 },
  { value: 'Kiến trúc monorepo', url: '#kien-truc-monorepo', depth: 2 },
  { value: 'Turborepo pipeline', url: '#turborepo-pipeline', depth: 3 },
  { value: 'Content layer song ngữ', url: '#content-layer-song-ngu', depth: 3 },
  { value: 'Triển khai lên Vercel', url: '#trien-khai-len-vercel', depth: 2 },
  { value: 'Kết luận', url: '#ket-luan', depth: 2 },
]

export const OnThisPage = () => (
  <div style={{ maxWidth: 360, padding: 16 }}>
    <TableOfContents toc={toc} />
  </div>
)
