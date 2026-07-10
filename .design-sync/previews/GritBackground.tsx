import { GritBackground } from 'web-2025'

// GritBackground phủ texture grit (png trong /static của app — KHÔNG có trong bundle nên
// texture không render được ở preview). Compose đúng cách dùng thật (Banner): khung ảnh bìa
// position:relative, GritBackground className="inset-0" phủ lên, caption nằm trên cùng.

export const PostBannerOverlay = () => (
  <div
    className='overflow-hidden rounded-lg border'
    style={{
      position: 'relative',
      height: 220,
      background: 'linear-gradient(135deg, #312e81, #0ea5e9)',
    }}
  >
    <GritBackground className='inset-0 opacity-75' />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 16,
      }}
    >
      <p className='text-sm font-medium' style={{ color: '#fff' }}>
        Hoàng hôn ở Đà Lạt — ảnh bìa bài viết
      </p>
      <p className='text-xs' style={{ color: 'rgba(255,255,255,0.7)' }}>
        Texture grit phủ lên banner để ảnh đỡ &quot;phẳng&quot; (asset /static không có trong bundle preview)
      </p>
    </div>
  </div>
)
