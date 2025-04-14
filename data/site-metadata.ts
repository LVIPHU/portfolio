import { env } from '@env'

export const SITE_METADATA = {
  title: `Lương Vĩ Phú's dev blog - portfolio`,
  author: process.env.owner,
  headerTitle: `Lương Vĩ Phú's dev blog`,
  description:
    'I am Lương Vĩ Phú, a sofware engineer. If you have any questions, please feel free to contact me. Thank you for visiting my website.',
  language: 'vi-VN',
  theme: 'system',
  siteUrl: env.NEXT_PUBLIC_APP_URL,
  siteRepo: 'https://github.com/LVIPHU/portfolio',
  siteLogo: `/static/images/logo.jpg`,
  socialBanner: `/static/images/twitter-card.jpeg`,
  email: process.env.email,
  github: 'https://github.com/LVIPHU',
  facebook: 'https://www.facebook.com/phuphu.phang.54',
  linkedin: '',
  resume: 'https://rxresu.me/kenlock.lvp/frontend-developer',
  locale: 'vi-VN',
  comments: {
    giscusConfigs: {
      repo: env.NEXT_PUBLIC_GISCUS_REPO!,
      repositoryId: env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID!,
      category: env.NEXT_PUBLIC_GISCUS_CATEGORY!,
      categoryId: env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!,
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
