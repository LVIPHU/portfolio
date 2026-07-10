import { ThemeSwitch } from 'web-2025'

// Không có ThemeProvider của next-themes trong preview: useTheme trả default
// context (theme undefined) → component fallback về 'light', icon Sun hiển thị.
export const IconToggle = () => <ThemeSwitch />

export const LargeIcon = () => <ThemeSwitch size={28} />
