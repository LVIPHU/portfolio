import '../globals.css'
import { t } from '@lingui/macro'
import linguiConfig from '../../../lingui.config'
import { getI18nInstance, PageLangParam } from '@/i18n'
import { LayoutProps } from '@/types/app'
import ProviderRegistry from '@/providers'
import { ReactNode, Suspense } from 'react'
import { Navbar } from '@/components/organisms'
import Loading from './loading'

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang) => ({ lang }))
}

export async function generateMetadata(props: PageLangParam) {
  const i18n = getI18nInstance((await props.params).lang)

  return {
    title: t(i18n)`Lương Vĩ Phú`
  }
}

type Props = LayoutProps & { modal: ReactNode }

export default async function RootLayout({ children, modal, params }: Readonly<Props>) {
  const lang = (await params).lang

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={'bg-background text-foreground'}>
        <ProviderRegistry params={params}>
          <Navbar lang={lang} />
          <Suspense fallback={<Loading />}>
            <main className='relative min-h-screen flex flex-col my-0 mx-auto overflow-hidden box-border'>
              {children}
            </main>
            {modal}
          </Suspense>
        </ProviderRegistry>
      </body>
    </html>
  )
}
