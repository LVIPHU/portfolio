import { ViewsCounter } from 'web-2025'

// Ngoài app gốc, fetch /api/stats fail → SWR trả data undefined → hook default
// views = 0 → hiển thị "0 views" (fail-an-toàn, đúng conventions.md).
export const PostMetaRow = () => (
  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground" style={{ padding: 24 }}>
    <span>19 tháng 7, 2016</span>
    <span>·</span>
    <span>18 phút đọc</span>
    <span>·</span>
    <ViewsCounter type="blog" slug="kien-truc-react-fiber" />
  </div>
)
