/**
 * Site metadata của portfolio 2025.
 * Chrome (URL, giscus, kbar, theme) khai tại đây; danh tính derive từ `me.profile`
 * để không trôi lệch với CV.
 */
import type { Localized } from './types'
import { profile } from './profile'

const vercelHost = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || (vercelHost ? `https://${vercelHost}` : undefined)

const github = profile.socials.find((s) => s.id === 'github')?.url ?? ''
const facebook = profile.socials.find((s) => s.id === 'facebook')?.url ?? ''
const linkedIn = profile.socials.find((s) => s.id === 'linkedin')?.url ?? ''

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
  email: string
  phone: string
  phoneHref: string
  location: Localized
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
  avatar: profile.avatar,
  title: {
    vi: 'Blog kỹ thuật & portfolio của Lương Vĩ Phú',
    en: "Lương Vĩ Phú's dev blog - portfolio",
  },
  author: profile.name,
  headerTitle: {
    vi: "Lương Vĩ Phú's dev blog",
    en: "Lương Vĩ Phú's dev blog",
  },
  description: {
    vi: 'Tôi là Lương Vĩ Phú, một kỹ sư phần mềm. Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với tôi. Cảm ơn bạn đã ghé thăm trang web của tôi.',
    en: 'I am Lương Vĩ Phú, a software engineer. If you have any questions, please feel free to contact me. Thank you for visiting my website.',
  },
  language: 'vi-VN',
  theme: 'system',
  siteUrl,
  siteRepo: 'https://github.com/LVIPHU/portfolio',
  siteLogo: `/static/images/logo.jpg`,
  socialBanner: `/static/images/twitter-card.jpg`,
  email: profile.email,
  phone: profile.phone,
  phoneHref: profile.phoneHref,
  location: profile.location,
  github,
  facebook,
  linkedIn,
  resume: profile.resumeUrl,
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
