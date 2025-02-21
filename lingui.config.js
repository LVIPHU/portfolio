/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
    locales: ['vn', 'en', 'pseudo'],
    pseudoLocale: 'pseudo',
    sourceLocale: 'vn',
    fallbackLocales: {
        default: 'vn'
    },
    catalogs: [
        {
            path: 'src/i18n/locales/{locale}',
            include: ['src/']
        }
    ]
}
