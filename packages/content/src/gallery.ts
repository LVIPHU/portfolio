import type { GalleryItem } from "./types";

/**
 * Thêm ảnh thật: bỏ file vào packages/content/assets/gallery/
 * rồi khai báo ở đây. Ảnh sẽ tự sync vào public/content/ của app khi dev/build.
 */
export const gallery: GalleryItem[] = [
  {
    src: "/content/gallery/placeholder-1.svg",
    alt: "Placeholder 1",
    caption: {
      vi: "Ảnh demo — thay bằng ảnh chân dung của bạn",
      en: "Demo image — replace with your portrait",
    },
    date: "2026-01",
  },
  {
    src: "/content/gallery/placeholder-2.svg",
    alt: "Placeholder 2",
    caption: {
      vi: "Ảnh demo — một chuyến đi chơi",
      en: "Demo image — a trip somewhere",
    },
    date: "2026-03",
  },
  {
    src: "/content/gallery/placeholder-3.svg",
    alt: "Placeholder 3",
    caption: {
      vi: "Ảnh demo — khoảnh khắc đời thường",
      en: "Demo image — everyday moment",
    },
    date: "2026-05",
  },
  {
    src: "/content/gallery/placeholder-4.svg",
    alt: "Placeholder 4",
    caption: {
      vi: "Ảnh demo — thiên nhiên",
      en: "Demo image — nature",
    },
    date: "2026-06",
  },
];
