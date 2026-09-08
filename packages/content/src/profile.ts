import type { Profile } from './types'

const AVATAR = 'https://avatars.githubusercontent.com/u/84316006?s=400&u=2f5f6e6e02e5195fddbe9c1d73c387cc22151cc5&v=4'

/** Danh tính — module riêng để chrome 2025 không kéo cả experience/projects vào client bundle. */
export const profile: Profile = {
  name: 'Lương Vĩ Phú',
  title: { vi: 'Frontend Developer', en: 'Frontend Developer' },
  tagline: {
    vi: 'Kỹ sư frontend 4 năm TypeScript production trên React/Next.js và Vue/Nuxt — tập trung hiệu năng, tiếp cận và chất lượng phát hành.',
    en: 'Frontend engineer with 4 years of production TypeScript across React/Next.js and Vue/Nuxt, focused on performance, accessibility, and release quality.',
  },
  bio: [
    {
      vi: 'Kỹ sư frontend với 4 năm kinh nghiệm production, xây ứng dụng TypeScript trên React/Next.js và Vue/Nuxt. Phụ trách frontend end-to-end cho nhắn tin thời gian thực, trải nghiệm sản phẩm WebGL và hệ thống đa ứng dụng, với trọng tâm hiệu năng, khả năng tiếp cận, hệ thống component tái sử dụng và chất lượng phát hành. Kết quả chọn lọc: giảm LCP mobile trong các lần chạy lab Lighthouse lặp lại từ 4.1s xuống 2.2s, giảm JavaScript ban đầu từ 1.8MB xuống 1.1MB, và giao 7 tính năng vận hành end-to-end trong 1 tháng.',
      en: 'Frontend engineer with 4 years of production experience building TypeScript applications across React/Next.js and Vue/Nuxt. Owns frontend products end to end across real-time messaging, WebGL product experiences, and multi-application systems, with a focus on performance, accessibility, reusable component systems, and release quality. Selected engineering outcomes include reducing mobile LCP in repeatable Lighthouse lab runs from 4.1s to 2.2s, reducing initial JavaScript from 1.8MB to 1.1MB, and shipping 7 end-to-end operations features within 1 month.',
    },
    {
      vi: 'Hiện đang làm Frontend Developer tại NEXSOFT TECHNOLOGY (foundation.tb.ink), phụ trách frontend cho TBchat, TB Wallet và TB Admin.',
      en: 'Currently a Frontend Developer at NEXSOFT TECHNOLOGY (foundation.tb.ink), owning frontend work across TBchat, TB Wallet, and TB Admin.',
    },
    {
      vi: 'Khi không code tôi thường nghe nhạc hoặc chơi các tựa game như League of Legends, Wuthering Waves. Những sở thích này giúp tôi duy trì sự sáng tạo và giải tỏa những căng thẳng.',
      en: "When I'm not coding, I usually listen to music or play games like League of Legends, Wuthering Waves. These hobbies help me maintain creativity and relieve stress.",
    },
  ],
  email: 'luongviphu0403@gmail.com',
  phone: '(+84) 528-307-775',
  phoneHref: 'tel:+84528307775',
  location: {
    vi: 'Phường Bình Thới, TP. Hồ Chí Minh',
    en: 'Binh Thoi Ward, Ho Chi Minh City',
  },
  avatar: AVATAR,
  resumeUrl: 'https://rxresu.me/kenlock.lvp/luong-vi-phu',
  company: { name: 'NEXSOFT TECHNOLOGY', url: 'https://foundation.tb.ink' },
  socials: [
    { id: 'github', label: 'GitHub', url: 'https://github.com/LVIPHU' },
    { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/luong-vi-phu' },
    { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/phuphu.phang.54' },
  ],
}
