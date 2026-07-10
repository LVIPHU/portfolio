import { AnimatedContent } from 'web-2025'

// AnimatedContent = wrapper framer-motion + IntersectionObserver (initial opacity 0, translate 50px).
// Capture tĩnh: distance={0} + animateOpacity={false} => trạng thái đầu == trạng thái cuối,
// nội dung hiển thị chắc chắn bất kể timing của animation.

export const SectionReveal = () => (
  <AnimatedContent distance={0} animateOpacity={false} className="p-4">
    <h2 className="text-2xl font-bold tracking-tight">Kinh nghiệm làm việc</h2>
    <p className="text-sm text-muted-foreground mt-2">
      Hơn 3 năm phát triển web với React, Next.js và TypeScript — từ landing page marketing đến hệ thống quản lý nội
      dung song ngữ. Section này trượt lên + fade in khi cuộn tới trên trang About.
    </p>
  </AnimatedContent>
)

export const StaggeredList = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420 }}>
    {['Thiết kế hệ thống component cho DS web-2025', 'Blog kỹ thuật song ngữ Việt/Anh', 'Tối ưu Core Web Vitals cho trang ảnh'].map(
      (title, idx) => (
        <AnimatedContent key={title} distance={0} animateOpacity={false} direction="horizontal" reverse delay={idx * 0.1}>
          <div className="rounded-md border p-4 text-sm font-medium">{title}</div>
        </AnimatedContent>
      )
    )}
  </div>
)
