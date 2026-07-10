import { Input, Label } from 'web-2025'

const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }

export const Basic = () => (
  <div style={col}>
    <Input placeholder="Tìm kiếm bài viết… / Search articles…" />
    <Input type="email" defaultValue="luongviphu0403@gmail.com" />
  </div>
)

export const WithLabel = () => (
  <div style={col}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Label htmlFor="fullname">Họ và tên / Full name</Label>
      <Input id="fullname" placeholder="Lương Vĩ Phú" />
    </div>
  </div>
)

export const States = () => (
  <div style={col}>
    <Input placeholder="Đang tải dữ liệu…" disabled />
    <Input aria-invalid defaultValue="khong-phai-email" type="email" />
    <p className="text-muted-foreground text-sm">Email không hợp lệ / Invalid email address.</p>
  </div>
)
