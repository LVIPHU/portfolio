import "../globals.css";

import { t } from '@lingui/macro'
import linguiConfig from '../../../lingui.config'
import { getI18nInstance, PageLangParam } from '@/i18n'
import { LayoutProps } from "@/types/app";
import ProviderRegistry from "@/providers";

export async function generateStaticParams() {
    return linguiConfig.locales.map((lang) => ({ lang }))
}

export async function generateMetadata(props: PageLangParam) {
    const i18n = getI18nInstance((await props.params).lang)

    return {
        title: t(i18n)`Lương Vĩ Phú`
    }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<LayoutProps>) {
  return (
    <html lang={(await params).lang} suppressHydrationWarning>
      <body className={'bg-background text-foreground'}>
        <ProviderRegistry params={params}>
            {children}
        </ProviderRegistry>
      </body>
    </html>
  );
}
