import { GrowingUnderline, NavigationLink } from 'web-2025'

// NavigationLink = next/link wrapper: link nội bộ giữ _self + aria-current="page",
// link ngoài (http/https) tự thêm target="_blank" + rel="noopener noreferrer".

export const HeaderNav = () => (
  <nav className="flex items-center gap-4 text-sm font-medium">
    <NavigationLink href="/blog">Bài viết</NavigationLink>
    <NavigationLink href="/projects">Dự án</NavigationLink>
    <NavigationLink href="/photos">Ảnh</NavigationLink>
    <NavigationLink href="https://github.com/LVIPHU" className="text-muted-foreground">
      GitHub ↗
    </NavigationLink>
  </nav>
)

export const BackToBlogLink = () => (
  <NavigationLink href="/blog" className="flex items-center gap-2 text-sm font-medium">
    <span aria-hidden>←</span>
    <GrowingUnderline active>Quay lại danh sách bài viết</GrowingUnderline>
  </NavigationLink>
)
