import { Badge } from 'web-2025'

const row: React.CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }

export const Variants = () => (
  <div style={row}>
    <Badge variant='default'>Nổi bật</Badge>
    <Badge variant='secondary'>Bản nháp</Badge>
    <Badge variant='destructive'>Ngừng hỗ trợ</Badge>
    <Badge variant='outline'>Open source</Badge>
  </div>
)

export const PostTags = () => (
  <div style={row}>
    <Badge variant='secondary'>react</Badge>
    <Badge variant='secondary'>nextjs</Badge>
    <Badge variant='secondary'>tailwindcss</Badge>
    <Badge variant='secondary'>typescript</Badge>
    <Badge variant='outline'>+3 thẻ khác</Badge>
  </div>
)

export const Meta = () => (
  <div style={row}>
    <Badge>18 phút đọc</Badge>
    <Badge variant='secondary'>Tiếng Việt</Badge>
    <Badge variant='secondary'>English</Badge>
    <Badge variant='outline'>2025</Badge>
  </div>
)
