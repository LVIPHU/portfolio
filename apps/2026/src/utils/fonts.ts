import { Anton, Roboto, Space_Grotesk } from 'next/font/google'

// Fonts thương hiệu: Anton (h1/h2) + Space Grotesk (h3/h4) + Roboto (body) — tất cả qua next/font.
//
// Space Grotesk thay Panchang (Fontshare): file Panchang Bold chỉ ~381 glyph, KHÔNG phủ tiếng
// Việt (Ả Ệ Ề Ơ Ư… đều thiếu trong cmap — đo bằng TTF Fontshare). Hậu quả: chữ Latin ra
// Panchang, dấu tiếng Việt rơi về sans-serif hệ thống → lệch nét / chồng dòng (đặc biệt
// `.h3` "Mình quan tâm / điều gì" và card "Trải nghiệm"). Space Grotesk có subset
// vietnamese trên Google Fonts, hình học gần Panchang, phân biệt rõ với Anton.

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

// Weight 700 khớp .h3/.h4 và .cardTitle (trước đây Panchang 700).
export const spaceGrotesk = Space_Grotesk({
  weight: ['700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-space-grotesk',
  display: 'swap',
})
