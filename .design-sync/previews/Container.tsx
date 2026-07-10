import { Container } from 'web-2025'

// Container = section .container mx-auto px-4 md:px-6 xl:px-12 — khung giới hạn chiều rộng của mọi trang.
// Nền muted bên ngoài để thấy rõ container tự căn giữa + padding ngang.

export const CenteredPageSection = () => (
  <div style={{ background: 'var(--color-muted)', padding: '20px 0', borderRadius: 8 }}>
    <Container className="bg-background rounded-lg py-2">
      <h2 className="text-2xl font-bold tracking-tight">Dự án nổi bật</h2>
      <p className="text-sm text-muted-foreground mt-2">
        Portfolio Monorepo, blog kỹ thuật và bộ sưu tập ảnh — tất cả nằm trong Container để đồng bộ lề trang trên mọi
        breakpoint.
      </p>
    </Container>
  </div>
)

export const AsArticle = () => (
  <div style={{ background: 'var(--color-muted)', padding: '20px 0', borderRadius: 8 }}>
    <Container as="article" className="bg-card border rounded-lg py-2">
      <p className="text-xs text-muted-foreground">15 tháng 5, 2024 · 8 phút đọc</p>
      <h3 className="text-xl font-semibold mt-1">Does JavaScript Promise.all() run in parallel or sequential?</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Rendered as an &lt;article&gt; element via the <code>as</code> prop — same centering and gutter behaviour.
      </p>
    </Container>
  </div>
)
