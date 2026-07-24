// Provider bọc mọi preview card của app 2026 (config.2026.json → provider.component).
//
// Vì sao cần: 2026 mặc định là DARK (ThemeProvider defaultTheme='dark' → class .dark
// trên <html>). Trong preview tĩnh không có <html class="dark">, nên nếu không bọc thì
// token rơi về nhánh :root (light) → card ra nền sáng + amber đậm, KHÔNG phải ngôn ngữ
// thiết kế 2026. Thêm .showcase-root để các biến --color-primary/--theme-* của
// showcase/theme.css cũng phân giải đúng.
import type { ReactNode } from 'react'

export function DsTheme2026({ children }: { children?: ReactNode }) {
  return (
    <div
      className='showcase-root dark'
      data-theme='dark'
      style={{
        background: 'var(--background, #000)',
        color: 'var(--foreground, #efefef)',
        padding: 24,
      }}
    >
      {children}
    </div>
  )
}
