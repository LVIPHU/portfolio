import { Boxes } from 'web-2025'

// Boxes = nền lưới isometric tương tác của trang chủ (30x30 ô, kéo xoay, hover đổi màu).
// .box-content là position:fixed => wrapper cần transform:translateZ(0) làm containing block,
// và overflow:hidden để cắt phần lưới 100vh tràn ra ngoài khung preview.
// Children được đặt vào grid bằng gridColumn/gridRow — giống Logo/VideoCard trên trang chủ.

export const IsometricGridHero = () => (
  <div
    style={{
      position: 'relative',
      height: 480,
      overflow: 'hidden',
      transform: 'translateZ(0)',
      borderRadius: 8,
      border: '1px solid var(--color-border)',
      background: 'var(--color-background)',
    }}
  >
    <Boxes>
      <div
        style={{
          gridColumn: '14 / 18',
          gridRow: '14 / 16',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <div className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium">Lương Vĩ Phú — Portfolio</div>
      </div>
    </Boxes>
  </div>
)
