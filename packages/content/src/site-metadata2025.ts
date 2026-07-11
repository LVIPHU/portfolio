/**
 * Site metadata của portfolio 2025 — hút từ apps/2025/data/site-metadata.ts (C2).
 * 3 chuỗi msg → Localized: title + description có bản dịch thật trong catalog vi-VN;
 * headerTitle là brand name nên vi = en (không phải thiếu dịch).
 * Field phụ thuộc env đọc process.env trực tiếp (giá trị resolve lúc app build/chạy
 * — package không import @env của app để tránh vòng phụ thuộc).
 */
import type { Localized } from './types'

export interface SiteMetadata2025 {
  avatar: string
  title: Localized
  author: string | undefined
  headerTitle: Localized
  description: Localized
  language: string
  theme: string
  siteUrl: string | undefined
  siteRepo: string
  siteLogo: string
  socialBanner: string
  email: string | undefined
  github: string
  facebook: string
  linkedIn: string
  resume: string
  locale: string
  comments: {
    giscusConfigs: {
      repo: string
      repositoryId: string
      category: string
      categoryId: string
      mapping: string
      reactions: string
      metadata: string
      theme: string
      darkTheme: string
      themeURL: string
      lang: string
    }
  }
  search: {
    kbarConfigs: {
      searchDocumentsPath: string
    }
  }
}

export const SITE_METADATA_2025: SiteMetadata2025 = {
  avatar: 'https://avatars.githubusercontent.com/u/84316006?s…00&u=2f5f6e6e02e5195fddbe9c1d73c387cc22151cc5&v=4',
  title: {
    vi: 'Blog kỹ thuật & portfolio của Lương Vĩ Phú',
    en: "Lương Vĩ Phú's dev blog - portfolio",
  },
  author: process.env.owner,
  headerTitle: {
    vi: "Lương Vĩ Phú's dev blog",
    en: "Lương Vĩ Phú's dev blog",
  },
  description: {
    vi: 'Tôi là Lương Vĩ Phú, một kỹ sư phần mềm. Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với tôi. Cảm ơn bạn đã ghé thăm trang web của tôi.',
    en: 'I am Lương Vĩ Phú, a sofware engineer. If you have any questions, please feel free to contact me. Thank you for visiting my website.',
  },
  language: 'vi-VN',
  theme: 'system',
  siteUrl: process.env.NEXT_PUBLIC_APP_URL,
  siteRepo: 'https://github.com/LVIPHU/portfolio',
  siteLogo: `/static/images/logo.jpg`,
  socialBanner: `/static/images/twitter-card.jpg`,
  email: process.env.email,
  github: 'https://github.com/LVIPHU',
  facebook: 'https://www.facebook.com/phuphu.phang.54',
  linkedIn: 'https://www.linkedin.com/in/luong-vi-phu',
  resume: 'https://rxresu.me/kenlock.lvp/luong-vi-phu',
  locale: 'vi-VN',
  comments: {
    giscusConfigs: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO ?? '',
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID ?? '',
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? '',
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? '',
      mapping: 'title',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'vi',
    },
  },
  search: {
    kbarConfigs: {
      searchDocumentsPath: `search.json`,
    },
  },
}
