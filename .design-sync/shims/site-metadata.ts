// Shim @data/site-metadata — bản gốc đọc process.env.owner/email (biến do
// next.config bơm lúc build) → throw trong browser bundle. Giá trị tĩnh tương đương.
import { msg } from './lingui-macro'

export const SITE_METADATA = {
  avatar: 'https://avatars.githubusercontent.com/u/84316006?v=4',
  title: msg`Lương Vĩ Phú's dev blog - portfolio`,
  author: 'Lương Vĩ Phú',
  headerTitle: msg`Lương Vĩ Phú's dev blog`,
  description: msg`I am Lương Vĩ Phú, a sofware engineer. If you have any questions, please feel free to contact me. Thank you for visiting my website.`,
  language: 'vi-VN',
  theme: 'system',
  siteUrl: 'https://web-2025.vercel.app',
  siteRepo: 'https://github.com/LVIPHU/portfolio',
  siteLogo: `/static/images/logo.jpg`,
  socialBanner: `/static/images/twitter-card.jpg`,
  email: 'luongviphu0403@gmail.com',
  github: 'https://github.com/LVIPHU',
  facebook: 'https://www.facebook.com/phuphu.phang.54',
  linkedIn: 'https://www.linkedin.com/in/luong-vi-phu',
  resume: 'https://rxresu.me/kenlock.lvp/luong-vi-phu',
  locale: 'vi-VN',
  comments: {
    giscusConfigs: {
      repo: '',
      repositoryId: '',
      category: '',
      categoryId: '',
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
