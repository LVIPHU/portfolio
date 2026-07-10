import { Input, Label } from 'web-2025'

const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }

export const Basic = () => (
  <div style={col}>
    <Label>Email liên hệ / Contact email</Label>
    <Label>
      Chủ đề / Subject <span className="text-muted-foreground font-normal">(không bắt buộc)</span>
    </Label>
  </div>
)

export const WithInput = () => (
  <div style={col}>
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="you@example.com" />
  </div>
)

export const DisabledField = () => (
  <div className="group" data-disabled="true" style={col}>
    <Label htmlFor="newsletter">Đăng ký nhận bản tin / Newsletter</Label>
    <Input id="newsletter" disabled placeholder="Tạm ngưng nhận đăng ký mới" />
  </div>
)
