import React from 'react'
import { LinkPreview } from 'web-2025'

// isStatic + imageSrc (data-URI) → KHÔNG fetch api.microlink.io.
// Ảnh preview giả lập screenshot trang: header bar + các khối text.
const shot =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="375"><rect width="600" height="375" fill="#0f172a"/><rect width="600" height="56" fill="#1e293b"/><circle cx="30" cy="28" r="10" fill="#38bdf8"/><rect x="52" y="20" width="120" height="16" rx="8" fill="#334155"/><rect x="40" y="96" width="360" height="28" rx="6" fill="#e2e8f0"/><rect x="40" y="140" width="480" height="12" rx="6" fill="#475569"/><rect x="40" y="162" width="440" height="12" rx="6" fill="#475569"/><rect x="40" y="204" width="520" height="130" rx="10" fill="url(#g)"/><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#6366f1"/></linearGradient></defs></svg>`
  )

const URL_2026 = 'https://web-2026.vercel.app'

// Trạng thái MỞ: component không expose prop `open` (Radix Root bị bọc kín) →
// mô phỏng hover bằng PointerEvent('pointerover') lên trigger (React synthesize
// onPointerEnter từ pointerover; openDelay 50ms). Dispatch lặp lại vài mốc thời
// gian cho chắc. framer-motion (AnimatePresence) kẹt keyframe đầu dưới Playwright
// clock → CSS ép motion.div về trạng thái cuối; popper neo sai hộp story-root →
// ghim wrapper ngay dưới câu văn.
export const HoverPreviewOpen = () => {
  const fired = React.useRef(false)
  return (
    <>
      <style>{`body{margin-right:0!important;padding-right:0!important}
[data-radix-popper-content-wrapper]{position:fixed!important;top:96px!important;left:50%!important;transform:translateX(-50%)!important}
[data-radix-popper-content-wrapper] .rounded-xl{opacity:1!important;transform:none!important}`}</style>
      <div
        ref={(el) => {
          if (!el || fired.current) return
          fired.current = true
          const hover = () => {
            const a = el.querySelector(`a[href="${URL_2026}"]`)
            a?.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))
          }
          setTimeout(hover, 60)
          setTimeout(hover, 300)
          setTimeout(hover, 800)
        }}
        style={{ minHeight: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 8 }}
      >
        <p className="text-sm text-muted-foreground" style={{ maxWidth: 480, textAlign: 'center' }}>
          Phiên bản mới nhất của portfolio —{' '}
          <LinkPreview url={URL_2026} isStatic imageSrc={shot} className="font-semibold">
            web-2026.vercel.app
          </LinkPreview>{' '}
          — xây bằng Next.js 16 và Tailwind v4.
        </p>
      </div>
    </>
  )
}

// Trạng thái nghỉ: trigger là link thường nằm trong câu văn.
export const InlineTriggerResting = () => (
  <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
    <p className="text-sm text-muted-foreground" style={{ maxWidth: 480 }}>
      Đọc thêm về Turborepo tại{' '}
      <LinkPreview url="https://turborepo.dev" isStatic imageSrc={shot} className="font-semibold">
        turborepo.dev
      </LinkPreview>{' '}
      — hover để xem preview trang.
    </p>
  </div>
)
