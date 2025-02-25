/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  format: 'po',
  locales: ['vi-VN', 'en-US'],
  sourceLocale: 'vi-VN',
  fallbackLocales: {
    default: 'vi-VN'
  },
  catalogs: [
    {
      path: 'src/i18n/locales/{locale}/messages',
      include: ['src/']
    }
  ]
}
