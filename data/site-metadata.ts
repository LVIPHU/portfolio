export const SITE_METADATA = {
  title: ``,
  author: process.env.owner,
  headerTitle: ``,
  description: '',
  language: 'vi-VN',
  theme: 'system',
  siteUrl: 'https://luongviphu.vercel.app',
  siteRepo: 'https://github.com/LVIPHU/portfolio',
  siteLogo: `/static/images/logo.jpg`,
  socialBanner: `/static/images/twitter-card.jpeg`,
  email: process.env.owner,
  github: 'https://github.com/LVIPHU',
  facebook: 'https://www.facebook.com/phuphu.phang.54',
  linkedin: '',
  locale: 'vi-VN',
  search: {
    kbarConfigs: {
      // path to load documents to search
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}
