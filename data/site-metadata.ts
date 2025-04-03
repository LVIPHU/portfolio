export const SITE_METADATA = {
  title: `Lương Vĩ Phú's dev blog - portfolio`,
  author: process.env.owner,
  headerTitle: `Lương Vĩ Phú's dev blog`,
  description:
    'I am Lương Vĩ Phú, a sofware engineer. If you have any questions, please feel free to contact me. Thank you for visiting my website.',
  language: 'vi-VN',
  theme: 'system',
  siteUrl: 'https://luongviphu.vercel.app',
  siteRepo: 'https://github.com/LVIPHU/portfolio',
  siteLogo: `/static/images/logo.jpg`,
  socialBanner: `/static/images/twitter-card.jpeg`,
  email: process.env.email,
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
