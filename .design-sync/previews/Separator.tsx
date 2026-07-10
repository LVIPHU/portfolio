import { Separator } from 'web-2025'

export const Horizontal = () => (
  <div style={{ maxWidth: 380 }}>
    <div className='space-y-1'>
      <h4 className='text-sm font-medium leading-none'>Bài viết mới nhất</h4>
      <p className='text-muted-foreground text-sm'>Latest posts from the blog.</p>
    </div>
    <Separator style={{ marginTop: 16, marginBottom: 16 }} />
    <p className='text-sm'>Kiến trúc React Fiber — 18 phút đọc</p>
  </div>
)

export const VerticalNav = () => (
  <div className='flex h-5 items-center gap-4 text-sm'>
    <span>Blog</span>
    <Separator orientation='vertical' />
    <span>Dự án</span>
    <Separator orientation='vertical' />
    <span>Giới thiệu</span>
    <Separator orientation='vertical' />
    <span>Liên hệ</span>
  </div>
)
