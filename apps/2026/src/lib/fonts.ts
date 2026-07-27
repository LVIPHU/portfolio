import { Anton, Roboto } from 'next/font/google'
import localFont from 'next/font/local'

// Fonts thương hiệu: Anton (headline) + Roboto (body) qua next/font, Panchang (h3/h4) TỰ HOST.
//
// Panchang trước đây nạp qua <link> tới api.fontshare.com. Bỏ cách đó vì API sinh CSS của
// Fontshare bị chặn theo lưu lượng: nó vẫn trả HTTP 200 nhưng thân là comment
// "Access to the Fontshare API has been temporarily restricted" — KHÔNG có @font-face nào.
// Hỏng kiểu đó hoàn toàn im lặng: không lỗi console, không request đỏ, chữ chỉ lặng lẽ rơi
// về Arial (đo được: Panchang rộng hơn Arial 56% nên nhìn ra ngay là sai font).
// File woff2 trên cdn.fontshare.com vẫn tải bình thường, chỉ endpoint sinh CSS bị chặn.
// Licence: ITF Free Font Licence — miễn phí cho personal lẫn commercial, cho phép self-host.
// Đã kiểm: bộ chữ phủ đủ tiếng Việt (Ệ Ậ Ọ Ự Ă Đ Ổ Ũ Ơ Ư Ê Ô + dấu), cần cho .h3 ở /resume.
export const anton = Anton({
  weight: '400',
  subsets: ['latin', 'vietnamese'],
  variable: '--font-anton',
  display: 'swap',
})

export const roboto = Roboto({
  weight: ['100', '400', '700', '900'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-roboto',
  display: 'swap',
})

// Chỉ cần weight 700: .h3/.h4 (globals.css) và .cardTitle đều dùng đúng nét đậm này.
export const panchang = localFont({
  src: './panchang-700.woff2',
  weight: '700',
  style: 'normal',
  variable: '--font-panchang',
  display: 'swap',
})
