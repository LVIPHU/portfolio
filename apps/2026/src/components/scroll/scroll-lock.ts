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
    e.preventDefault()
  }
  window.addEventListener('keydown', onKey, true)
  return () => window.removeEventListener('keydown', onKey, true)
}
