// Chặn cuộn bằng BÀN PHÍM trong lúc tấm phủ (intro / menu) đang che màn.
//
// Vì sao cần riêng: lenis.stop() chỉ chặn wheel + touch (onVirtualScroll preventDefault khi
// isStopped). Phần chặn còn lại của lenis là CSS `overflow: clip` — mà app này TRUNG HOÀ luật đó
// (xem app/native-scrollbar.css) vì `clip` bỏ luôn thanh cuộn, làm mọi lớp `position: fixed` và
// canvas 3D đổi kích thước, cả trang nhích ngang mỗi lần mở/đóng.
// Đổi lại phải tự lo bàn phím ở đây. Kéo thanh cuộn bằng chuột thì vẫn cuộn được — đánh đổi đã
// cân nhắc: tấm phủ là fixed nên không vỡ gì.

const SCROLL_KEYS = new Set([
  ' ',
  'Spacebar',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
])

const isSpace = (key: string) => key === ' ' || key === 'Spacebar'

/**
 * Gắn bộ chặn phím cuộn (và tuỳ chọn cả Tab). Trả về hàm gỡ — dùng thẳng làm cleanup của useEffect.
 *
 * @param blockTab Intro cần chặn Tab: tấm phủ che kín màn nhưng nội dung phía sau vẫn focus được,
 *   người dùng bàn phím sẽ tab vào control vô hình (WCAG focus-not-obscured). Menu thì KHÔNG chặn —
 *   trong đó có link và công tắc phải Tab tới được.
 */
export function blockScrollKeys(blockTab = false): () => void {
  const onKey = (e: KeyboardEvent) => {
    if (blockTab && e.key === 'Tab') {
      e.preventDefault()
      return
    }
    if (!SCROLL_KEYS.has(e.key)) return
    // Đang gõ trong input/textarea/contenteditable thì phím mũi tên là để di chuyển con trỏ.
    // `instanceof HTMLElement` chứ KHÔNG ép kiểu: sự kiện bắn thẳng vào window/document có
    // target không phải element, gọi .closest() trên đó là ném lỗi và cả handler chết — đúng lỗi
    // đã đo: phím vẫn cuộn được dù listener đã gắn.
    const el = e.target
    if (el instanceof HTMLElement && (el.isContentEditable || el.closest('input, textarea, select'))) return
    // Space là phím KÍCH HOẠT chuẩn của <button>: chặn nó thì công tắc ngôn ngữ/theme trong menu
    // bấm bằng bàn phím không ăn (Enter vẫn chạy nên lỗi rất dễ lọt). Mũi tên/PageDown trên nút
    // thì vẫn chặn — chúng chỉ cuộn trang chứ không kích hoạt gì.
    if (isSpace(e.key) && el instanceof HTMLElement && el.closest('button, [role="button"], summary')) return
    e.preventDefault()
  }
  window.addEventListener('keydown', onKey, true)
  return () => window.removeEventListener('keydown', onKey, true)
}

/**
 * Chặn cuộn bằng WHEEL/TOUCH khi không có lenis (prefers-reduced-motion: SmoothScroll không mount
 * ReactLenis nên không ai preventDefault hộ). KHÔNG dùng `overflow: hidden` trên <html> — nó giấu
 * thanh cuộn, làm khung nội dung và mọi lớp position:fixed rộng thêm, đúng kiểu nhích ngang mà
 * native-scrollbar.css đã đi sửa.
 */
export function blockWheelScroll(): () => void {
  const onScrollGesture = (e: Event) => {
    if (e.cancelable) e.preventDefault()
  }
  const opts = { passive: false, capture: true } as const
  window.addEventListener('wheel', onScrollGesture, opts)
  window.addEventListener('touchmove', onScrollGesture, opts)
  return () => {
    window.removeEventListener('wheel', onScrollGesture, opts)
    window.removeEventListener('touchmove', onScrollGesture, opts)
  }
}
