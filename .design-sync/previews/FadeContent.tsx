import { FadeContent } from 'web-2025'

// FadeContent = fade/blur-in theo IntersectionObserver (CSS transition, không framer-motion).
// Capture tĩnh: initialOpacity={1} (hiển thị cả khi IO chưa bắn) + duration={1} (transition
// kết thúc ngay lập tức) — trạng thái cuối là opacity 1 / blur 0 như trong app sau khi cuộn tới.

export const IntroFade = () => (
  <FadeContent duration={1} initialOpacity={1} className="p-4">
    <h2 className="text-2xl font-bold tracking-tight">Xin chào, mình là Phú 👋</h2>
    <p className="text-sm text-muted-foreground mt-2">
      Frontend developer thích xây design system và viết blog kỹ thuật song ngữ. Đoạn giới thiệu này fade in khi trang
      chủ tải xong.
    </p>
  </FadeContent>
)

export const BlurFadeLogo = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
    <FadeContent blur duration={1} initialOpacity={1}>
      <div
        className="bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold"
        style={{ width: 96, height: 96, fontSize: 28 }}
      >
        VP
      </div>
    </FadeContent>
  </div>
)
