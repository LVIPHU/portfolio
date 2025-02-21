import { LayoutProps } from "@/types/app";
import { allMessages, initLingui } from "@/i18n";
import { ThemeProvider } from "@/providers/theme";
import { LocaleProvider }from '@/providers/locale'

export default async function ProviderRegistry({ children, params }: LayoutProps) {
    const lang = (await params).lang
    initLingui(lang)
    return (
        <LocaleProvider initialLocale={lang} initialMessages={allMessages[lang]!}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </LocaleProvider>
    )
}
