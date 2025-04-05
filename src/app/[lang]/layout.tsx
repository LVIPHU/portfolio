import '@/styles/main.css'
import 'react-medium-image-zoom/dist/styles.css'
import { msg } from '@lingui/core/macro'
import linguiConfig from '../../../lingui.config'
import { getI18nInstance, PageLangParam } from '@/i18n'
import { LayoutProps } from '@/types/app'
import ProviderRegistry from '@/providers'
import { ReactNode } from 'react'
import { Navbar } from '@/components/organisms'
import { JetBrains_Mono, Nunito, Playpen_Sans } from 'next/font/google'
import { cn } from '@/utils'
import { SITE_METADATA } from '@data/site-metadata'

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

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang) => ({ lang }))
}

export async function generateMetadata(props: PageLangParam) {
  const i18n = await getI18nInstance((await props.params).lang)

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

type Props = LayoutProps & { modal: ReactNode }

export default async function RootLayout({ children, modal, params }: Readonly<Props>) {
  const lang = (await params).lang
  return (
    <html
      lang={lang}
      className={cn('scroll-smooth', FONT_NUNITO.variable, FONT_JETBRAINS_MONO.variable, FONT_PLAYPEN_SANS.variable)}
      suppressHydrationWarning
    >
      <body>
        <ProviderRegistry params={params}>
          <Navbar lang={lang} />
          {children}
          {modal}
          <div id='modal-root' />
        </ProviderRegistry>
      </body>
    </html>
  )
}
