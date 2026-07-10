import { EditOnGithub } from 'web-2025'

// Link footer bài viết trỏ về file MDX trong repo (SITE_METADATA.siteRepo + /blob/main/data/<filePath>).
export const PostFooterLink = () => (
  <div className="flex items-center justify-center gap-2 text-sm" style={{ padding: 24 }}>
    <EditOnGithub filePath="blog/kien-truc-react-fiber.mdx" />
    <span className="text-muted-foreground">•</span>
    <span className="text-muted-foreground">Cập nhật lần cuối 15/05/2024</span>
  </div>
)
