import type { GalleryItem } from './types'

/**
 * Thêm ảnh thật: bỏ file vào packages/content/assets/gallery/
 * rồi khai báo ở đây. Ảnh sẽ tự sync vào public/content/ của app khi dev/build.
 * width/height lấy từ viewBox SVG (placeholder) — next/image cần để hết CLS.
 */
export const gallery: GalleryItem[] = [
  {
    src: '/content/gallery/placeholder-1.svg',
    alt: 'Chân dung placeholder — gradient tím, silhouette người',
    caption: {
      vi: 'Ảnh demo — thay bằng ảnh chân dung của bạn',
      en: 'Demo image — replace with your portrait',
    },
    date: '2026-01',
    width: 800,
    height: 1000,
  },
  {
    src: '/content/gallery/placeholder-2.svg',
    alt: 'Ảnh chuyến đi placeholder — khung cảnh demo',
    caption: {
      vi: 'Ảnh demo — một chuyến đi chơi',
      en: 'Demo image — a trip somewhere',
    },
    date: '2026-03',
    width: 1200,
    height: 800,
  },
  {
    src: '/content/gallery/placeholder-3.svg',
    alt: 'Khoảnh khắc đời thường placeholder',
    caption: {
      vi: 'Ảnh demo — khoảnh khắc đời thường',
      en: 'Demo image — everyday moment',
    },
    date: '2026-05',
    width: 1200,
    height: 800,
  },
  {
    src: '/content/gallery/placeholder-4.svg',
    alt: 'Thiên nhiên placeholder',
    caption: {
      vi: 'Ảnh demo — thiên nhiên',
      en: 'Demo image — nature',
    },
    date: '2026-06',
    width: 800,
    height: 1000,
  },
]
