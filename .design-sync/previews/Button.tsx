import { Button } from 'web-2025'

const row: React.CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }

export const Variants = () => (
  <div style={row}>
    <Button variant='default'>Xem portfolio</Button>
    <Button variant='secondary'>Tải CV</Button>
    <Button variant='outline'>Liên hệ</Button>
    <Button variant='ghost'>Bỏ qua</Button>
    <Button variant='destructive'>Xóa bài viết</Button>
    <Button variant='link'>Đọc thêm</Button>
  </div>
)

export const Sizes = () => (
  <div style={row}>
    <Button size='sm'>Nhỏ</Button>
    <Button size='default'>Mặc định</Button>
    <Button size='lg'>Lớn</Button>
    <Button size='icon' aria-label='settings'>
      ⚙
    </Button>
  </div>
)

export const States = () => (
  <div style={row}>
    <Button>Bình thường</Button>
    <Button disabled>Đang xử lý…</Button>
    <Button variant='outline' disabled>
      Không khả dụng
    </Button>
  </div>
)
