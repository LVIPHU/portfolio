import { LocaleSwitch } from 'web-2025'

// Trạng thái ĐÓNG (đúng khuyến nghị review — không ép mở dropdown).
// usePathname shim = '/' → locale rút ra là chuỗi rỗng → trigger hiển thị
// placeholder của chính component ("Select a timezone" — copy gốc trong source,
// Trans đã shim về children). Guard chống body-shift khi user mở Select live.
export const ClosedTrigger = () => (
  <>
    <style>{'html{scrollbar-gutter:stable}body{margin-right:0!important;padding-right:0!important}'}</style>
    <div style={{ maxWidth: 260 }}>
      <LocaleSwitch />
    </div>
  </>
)
