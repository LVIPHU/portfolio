import { Label, Textarea } from 'web-2025'

const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420 }

export const Basic = () => (
  <div style={col}>
    <Textarea placeholder='Viết lời nhắn cho mình… / Write me a message…' />
  </div>
)

export const ContactField = () => (
  <div style={col}>
    <Label htmlFor='message'>Lời nhắn / Message</Label>
    <Textarea
      id='message'
      rows={4}
      defaultValue='Chào Phú, mình vừa đọc bài viết về React Fiber trên blog. Rất muốn trao đổi thêm về cơ hội hợp tác frontend.'
    />
    <p className='text-muted-foreground text-sm'>Tối đa 500 ký tự / Max 500 characters.</p>
  </div>
)

export const Disabled = () => (
  <div style={col}>
    <Textarea disabled defaultValue='Bình luận đã bị khóa cho bài viết này. / Comments are locked for this post.' />
  </div>
)
