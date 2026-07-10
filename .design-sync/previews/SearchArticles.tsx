import { SearchArticles } from 'web-2025'

// SearchArticles = ô tìm kiếm của trang Blog: input + icon kính lúp (lucide Search).
// onChange là prop bắt buộc — preview truyền noop. Label vừa là placeholder vừa là aria-label.

export const BlogSearch = () => (
  <div style={{ maxWidth: 420 }}>
    <SearchArticles label="Tìm kiếm bài viết" onChange={() => {}} />
  </div>
)

export const BlogPageHeader = () => (
  <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div>
      <h2 className="text-2xl font-bold tracking-tight">Tất cả bài viết</h2>
      <p className="text-sm text-muted-foreground mt-1">24 bài · cập nhật tháng 5, 2024</p>
    </div>
    <SearchArticles label="Search articles" onChange={() => {}} />
  </div>
)
