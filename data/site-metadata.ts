export const SITE_METADATA = {
  title: ``,
  author: 'Luong Vi Phu',
  headerTitle: ``,
  description: '',
  language: 'vi-VN',
  theme: 'system',
  siteUrl: '',
  siteRepo: '',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.jpg`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.jpeg`,
  email: 'kenlock.lvp@gmail.com',
  github: 'https://github.com/LVIPHU',
  facebook: '',
  linkedin: '',
  locale: 'vi-VN',
  stickyNav: true,
  search: {
    kbarConfigs: {
      // path to load documents to search
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`
    }
  }
}
