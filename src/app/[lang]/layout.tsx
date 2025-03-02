import '@/styles/main.css'
import { t } from '@lingui/macro'
import linguiConfig from '../../../lingui.config'
import { getI18nInstance, PageLangParam } from '@/i18n'
import { LayoutProps } from '@/types/app'
import ProviderRegistry from '@/providers'
import { ReactNode, Suspense } from 'react'
import { Navbar } from '@/components/organisms'
import Loading from './loading'
import { Montserrat } from 'next/font/google'
import { cn } from '@/libs/utils'

const font = Montserrat({
  weight: ['300','400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
})

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang) => ({ lang }))
}

export async function generateMetadata(props: PageLangParam) {
  const i18n = getI18nInstance((await props.params).lang)
  return {
    title: process.env.owner,
    description: t(
      i18n
    )`Tôi là Lương Vĩ Phú, một lập trình viên web. Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với tôi. Cảm ơn bạn đã ghé thăm trang web của tôi.`,
    openGraph: {
      title: process.env.owner,
      description: t(
        i18n
      )`Tôi là Lương Vĩ Phú, một lập trình viên web. Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với tôi. Cảm ơn bạn đã ghé thăm trang web của tôi.`
    }
  }
}

type Props = LayoutProps & { modal: ReactNode }

export default async function RootLayout({ children, modal, params }: Readonly<Props>) {
  const lang = (await params).lang

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={cn('bg-background text-foreground', font.className)}>
        <ProviderRegistry params={params}>
          <Navbar lang={lang} />
          <Suspense fallback={<Loading />}>
            <main className='relative min-h-screen flex flex-col my-0 mx-auto overflow-hidden'>{children}</main>
            {modal}
          </Suspense>
        </ProviderRegistry>
      </body>
    </html>
  )
}
