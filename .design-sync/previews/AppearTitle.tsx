import { AppearTitle } from 'web-2025'

// AppearTitle giấu chữ bằng translateY(110%) trong overflow:hidden và chỉ bỏ giấu khi
// IntersectionObserver bắn. Ảnh chụp tĩnh diễn ra trước khi IO + transition 1.2s kịp
// chạy → card trắng. Không có prop nào ép hiện, nên vô hiệu hoá transform ngay trong
// preview (khớp theo tên class băm của CSS module).
const forceVisible = `
  span[class*="appear-title-module"] > span { transform: none !important; }
`

export const SectionHeading = () => (
  <div style={{ width: 560, maxWidth: '100%' }}>
    <style>{forceVisible}</style>
    <h2 className='h2'>
      <AppearTitle>DỰ ÁN NỔI BẬT</AppearTitle>
    </h2>
    <h2 className='h2'>
      <AppearTitle>BÀI VIẾT MỚI</AppearTitle>
    </h2>
  </div>
)

export const WithDiacritics = () => (
  <div style={{ width: 560, maxWidth: '100%' }}>
    <style>{forceVisible}</style>
    <h2 className='h2'>
      <AppearTitle>VỀ MÌNH</AppearTitle>
    </h2>
    <h2 className='h2'>
      <AppearTitle>MÌNH DÙNG GÌ</AppearTitle>
    </h2>
  </div>
)
