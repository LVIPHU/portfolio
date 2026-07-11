import '@/styles/main.css'
import 'react-medium-image-zoom/dist/styles.css'
import { msg } from '@lingui/core/macro'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getI18nInstance } from '@/i18n'
import ProviderRegistry from '@/providers'
import { ReactNode } from 'react'
import { Navbar } from '@/components/organisms'
import { JetBrains_Mono, Nunito, Playpen_Sans } from 'next/font/google'
import { cn } from '@/utils'
import { SITE_METADATA } from '@data/site-metadata'
import { KBarSearchProvider } from '@/components/organisms/search/kbar-provider'

const FONT_PLAYPEN_SANS = Playpen_Sans({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  weight: ['800'],
  variable: '--font-playpen-sans',
})

const FONT_NUNITO = Nunito({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
})

const FONT_JETBRAINS_MONO = JetBrains_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin', 'vietnamese'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

/** KHUNG CHUYỂN TIẾP (M-09, gỡ ở plan C06-03): map locale mới → catalog Lingui cũ */
const toLinguiLocale = (locale: string) => (locale === 'en' ? 'en-US' : 'vi-VN')

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Params = { params: Promise<{ locale: string }> }

export async function generateMetadata(props: Params & { children: ReactNode; modal: ReactNode }) {
  const { locale } = await props.params
  const i18n = await getI18nInstance(toLinguiLocale(locale))

  const title = i18n._(msg`Lương Vĩ Phú's dev blog - portfolio`)
  const description = i18n._(
    msg`I am Lương Vĩ Phú, a sofware engineer. If you have any questions, please feel free to contact me. Thank you for visiting my website.`
  )

  return {
    metadataBase: new URL(SITE_METADATA.siteUrl),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: './',
      siteName: title,
      images: [SITE_METADATA.socialBanner],
      locale: 'vi_VN',
      type: 'website',
    },
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${SITE_METADATA.siteUrl}/feed.xml`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    twitter: {
      title: title,
      card: 'summary_large_image',
      images: [SITE_METADATA.socialBanner],
    },
  }
}

type Props = Params & { children: ReactNode; modal: ReactNode }

export default async function RootLayout({ children, modal, params }: Readonly<Props>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  return (
    <html
      lang={locale}
      className={cn('scroll-smooth', FONT_NUNITO.variable, FONT_JETBRAINS_MONO.variable, FONT_PLAYPEN_SANS.variable)}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider>
          {/* ProviderRegistry (Lingui) giữ cho component CHƯA port — gỡ ở C06-03 */}
          <ProviderRegistry linguiLocale={toLinguiLocale(locale)}>
            <KBarSearchProvider configs={SITE_METADATA.search.kbarConfigs}>
              <Navbar lang={locale} />
              {children}
              {modal}
            </KBarSearchProvider>
          </ProviderRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
