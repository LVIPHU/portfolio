import type { SandpackTheme } from '@codesandbox/sandpack-react'

// C11 (D-05): theme trỏ CSS var semantic của app (var(--color-*)) — tự ăn
// dark/light theo token từng app, KHÔNG hardcode hex (2 app 2 bảng màu vẫn 1 theme).
// Cả 2 app đều định nghĩa đủ các --color-* dưới đây (Tailwind v4 @theme).
// Sandpack chấp nhận chuỗi CSS bất kỳ cho mỗi ô màu.
//
// ACCENT: token cú pháp là chữ 13px nên KHÔNG được dùng thẳng --color-primary — web-2026
// đặt primary = gold #DFB454, chỉ 1.69:1 trên nền sáng. Đi qua --mdx-accent để app tự chọn;
// app không khai thì fallback về --color-primary, giữ nguyên hành vi cũ (web-2025).
const ACCENT = 'var(--mdx-accent, var(--color-primary))'

export const cssVarTheme: SandpackTheme = {
  colors: {
    surface1: 'var(--color-background)',
    surface2: 'var(--color-muted)',
    surface3: 'var(--color-accent)',
    clickable: 'var(--color-muted-foreground)',
    base: 'var(--color-foreground)',
    disabled: 'var(--color-muted-foreground)',
    hover: 'var(--color-foreground)',
    accent: ACCENT,
    error: 'var(--color-destructive)',
    errorSurface: 'var(--color-muted)',
  },
  syntax: {
    plain: 'var(--color-foreground)',
    comment: { color: 'var(--color-muted-foreground)', fontStyle: 'italic' },
    keyword: ACCENT,
    tag: ACCENT,
    punctuation: 'var(--color-muted-foreground)',
    definition: 'var(--color-foreground)',
    property: ACCENT,
    static: 'var(--color-destructive)',
    string: ACCENT,
  },
  font: {
    body: 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)',
    mono: 'var(--font-mono, ui-monospace, SFMono-Regular, monospace)',
    size: '13px',
    lineHeight: '20px',
  },
}
