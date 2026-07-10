import { DiscussOnX } from 'web-2025'

// Link footer bài viết — ở viewport capture 900px nhánh md:inline " (Twitter)" hiển thị.
export const PostFooterLink = () => (
  <div className="flex items-center justify-center gap-2 text-sm" style={{ padding: 24 }}>
    <DiscussOnX postUrl="https://web-2025.vercel.app/blog/kien-truc-react-fiber" />
    <span className="text-muted-foreground">•</span>
    <span className="text-muted-foreground">1.2K lượt xem</span>
  </div>
)
