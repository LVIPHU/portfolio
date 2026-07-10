import { FloatingDock } from 'web-2025'

// Dock điều hướng chính của site. Viewport capture 900px ≥ md → bản desktop
// (dải tròn bo full) hiển thị, bản mobile ẩn. Icon là ReactNode — lucide-react
// không import trực tiếp được trong preview nên dùng emoji trong span (đủ theo
// contract icon: ReactNode). usePathname shim = '/' → item Trang chủ có chấm
// indicator active dưới icon.
const icon = (glyph: string) => (
  <span style={{ fontSize: 16, lineHeight: 1 }} aria-hidden>
    {glyph}
  </span>
)

const items = [
  { type: 'link', title: 'Trang chủ', icon: icon('🏠'), href: '/' },
  { type: 'link', title: 'Blog', icon: icon('✍️'), href: '/blog' },
  { type: 'link', title: 'Dự án', icon: icon('🧩'), href: '/projects' },
  null, // separator dọc
  { type: 'link', title: 'About', icon: icon('👤'), href: '/about' },
  { type: 'action', title: 'Cài đặt', icon: icon('⚙️'), onClick: () => {} },
]

export const NavigationDock = () => (
  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 14 }}>
    <FloatingDock items={items as any} />
  </div>
)
