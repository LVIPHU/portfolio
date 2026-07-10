import { Toggle } from 'web-2025'

const row: React.CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }

export const Variants = () => (
  <div style={row}>
    <Toggle>Đậm</Toggle>
    <Toggle defaultPressed>Đậm</Toggle>
    <Toggle variant="outline">Nghiêng</Toggle>
    <Toggle variant="outline" defaultPressed>
      Nghiêng
    </Toggle>
  </div>
)

export const Sizes = () => (
  <div style={row}>
    <Toggle variant="outline" size="sm">
      Aa
    </Toggle>
    <Toggle variant="outline" size="default">
      Aa
    </Toggle>
    <Toggle variant="outline" size="lg">
      Aa
    </Toggle>
  </div>
)

export const States = () => (
  <div style={row}>
    <Toggle variant="outline" defaultPressed>
      Đang theo dõi blog
    </Toggle>
    <Toggle variant="outline" disabled>
      Không khả dụng
    </Toggle>
  </div>
)
