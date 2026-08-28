import '@/styles/main.css'
import 'react-medium-image-zoom/dist/styles.css'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@portfolio/i18n'
import ProviderRegistry from '@/providers'
import { ReactNode } from 'react'
import { Navbar } from '@/components/organisms'
import { JetBrains_Mono, Nunito, Playpen_Sans } from 'next/font/google'
import { cn } from '@portfolio/utils'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { KBarSearchProvider } from '@/components/organisms/search/kbar-provider'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { UmamiAnalytics } from '@/components/organisms/umami-analytics'
import { siteOrigin, withOg } from '@/utils/og-meta'

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Params = { params: Promise<{ locale: string }> }

export async function generateMetadata(props: Params & { children: ReactNode; modal: ReactNode }) {
  const { locale } = await props.params
  // getTranslations({locale}) tường minh để generateMetadata không opt vào dynamic rendering
  const t = await getTranslations({ locale })

  const title = t('App.lươngVĩPhúS')
  const description = t('App.iAmLươngVĩ')
  const origin = siteOrigin()

  return {
    metadataBase: new URL(origin),
    ...withOg(
      { locale, path: '/', title, description, siteName: title },
      {
        title: {
          default: title,
          template: `%s | ${title}`,
        },
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large' as const,
            'max-snippet': -1,
          },
        },
        alternateTypes: {
          'application/rss+xml': `${origin}/feed.xml`,
        },
      }
    ),
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
          <UmamiAnalytics />
          <SpeedInsights />
          <ProviderRegistry>
            <KBarSearchProvider configs={SITE_METADATA.search.kbarConfigs}>
              <Navbar />
              {children}
              {modal}
            </KBarSearchProvider>
          </ProviderRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
