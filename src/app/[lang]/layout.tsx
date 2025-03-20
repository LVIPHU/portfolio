import '@/styles/main.css'
import { t } from '@lingui/macro'
import linguiConfig from '../../../lingui.config'
import { getI18nInstance, PageLangParam } from '@/i18n'
import { LayoutProps } from '@/types/app'
import ProviderRegistry from '@/providers'
import { ReactNode } from 'react'
import { Navbar } from '@/components/organisms'
import { JetBrains_Mono, Nunito, Playpen_Sans } from 'next/font/google'
import { cn } from '@/libs/utils'

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
  return {
    title: process.env.owner,
    description: t(
      i18n
    )`I am Lương Vĩ Phú, a sofware engineer. If you have any questions, please feel free to contact me. Thank you for visiting my website.`,
    openGraph: {
      title: process.env.owner,
      description: t(
        i18n
      )`I am Lương Vĩ Phú, a sofware engineer. If you have any questions, please feel free to contact me. Thank you for visiting my website.`,
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
        </ProviderRegistry>
      </body>
    </html>
  )
}
