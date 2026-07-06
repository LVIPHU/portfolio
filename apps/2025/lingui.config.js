/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  format: 'po',
  locales: ['vi-VN', 'en-US', 'ja-JP', 'zh-TW', 'zh-CN', 'ko-KR'],
  sourceLocale: 'en-US',
  fallbackLocales: {
    default: 'vi-VN',
  },
  catalogs: [
    {
      path: 'src/i18n/locales/{locale}/messages',
      include: ['src/'],
    },
  ],
}
