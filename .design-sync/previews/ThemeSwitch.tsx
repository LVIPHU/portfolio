import { ThemeSwitch } from 'web-2025'

// Không có ThemeProvider của next-themes trong preview: useTheme trả default
// context (theme undefined) → component fallback về 'light', icon Sun hiển thị.
// Lưu ý: size khác mặc định làm lộ mép icon kế trong dải (overflow-hidden đúng
// bằng size) — chỉ demo size mặc định.
export const IconToggle = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <ThemeSwitch />
    <span className="text-sm text-muted-foreground">Đổi giao diện sáng / tối</span>
  </div>
)
