/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['vn', 'en', 'pseudo'],
  pseudoLocale: 'pseudo',
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en'
  },
  catalogs: [
    {
      path: 'src/i18n/locales/{locale}',
      include: ['src/']
    }
  ]
}
