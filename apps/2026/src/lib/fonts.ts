import { Anton, Roboto } from 'next/font/google'

// Fonts thương hiệu: Anton (headline) + Roboto (body) qua next/font.
// Panchang (h3/h4) không có trên next/font → nạp qua Fontshare <link> trong layout.
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
