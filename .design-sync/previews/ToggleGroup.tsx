import { ToggleGroup, ToggleGroupItem } from 'web-2025'

const row: React.CSSProperties = { display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start' }

export const ViewSwitch = () => (
  <div style={row}>
    <ToggleGroup type="single" defaultValue="grid" variant="outline">
      <ToggleGroupItem value="grid">Lưới</ToggleGroupItem>
      <ToggleGroupItem value="list">Danh sách</ToggleGroupItem>
    </ToggleGroup>
  </div>
)

export const TagFilter = () => (
  <div style={row}>
    <ToggleGroup type="multiple" defaultValue={['react', 'nextjs']}>
      <ToggleGroupItem value="react">React</ToggleGroupItem>
      <ToggleGroupItem value="nextjs">Next.js</ToggleGroupItem>
      <ToggleGroupItem value="tailwind">Tailwind</ToggleGroupItem>
      <ToggleGroupItem value="typescript">TypeScript</ToggleGroupItem>
    </ToggleGroup>
  </div>
)

export const Sizes = () => (
  <div style={{ ...row, flexDirection: 'column', alignItems: 'flex-start' }}>
    <ToggleGroup type="single" defaultValue="vi" variant="outline" size="sm">
      <ToggleGroupItem value="vi">Tiếng Việt</ToggleGroupItem>
      <ToggleGroupItem value="en">English</ToggleGroupItem>
    </ToggleGroup>
    <ToggleGroup type="single" defaultValue="vi" variant="outline" size="lg">
      <ToggleGroupItem value="vi">Tiếng Việt</ToggleGroupItem>
      <ToggleGroupItem value="en">English</ToggleGroupItem>
    </ToggleGroup>
  </div>
)
