import { Setting } from 'web-2025'

// Panel cài đặt (thường nằm trong popover của FloatingDock) — render trạng thái
// ĐÓNG của LocaleSwitch/ThemeSwitch bên trong. Khung viền mô phỏng popover chứa
// nó ngoài app thật. Guard chống body-shift khi user mở Select live trong DS pane.
// LocaleSwitch hiện placeholder gốc (pathname shim '/'), ThemeSwitch fallback
// icon Sun vì không có ThemeProvider.
export const SettingsPanel = () => (
  <>
    <style>{'html{scrollbar-gutter:stable}body{margin-right:0!important;padding-right:0!important}'}</style>
    <div className='rounded-lg border p-4' style={{ maxWidth: 320 }}>
      <Setting />
    </div>
  </>
)
