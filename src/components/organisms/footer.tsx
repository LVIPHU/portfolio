import {FloatingDock} from "@/components/atoms";
import {Trans} from "@lingui/react/macro";
import {Contact, House, Image, Lightbulb} from "lucide-react";

type Props = {
    lang: string
}

export const Footer = (props: Props) => {
    const {lang} = props
    const links = [
        {
            title: <Trans>Home</Trans>,
            icon: (
                <House className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: `/${lang}`,
        },
        {
            title: <Trans>Projects</Trans>,
            icon: (
                <Lightbulb className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: `/${lang}/projects`,
        },
        {
            title: <Trans>Photos</Trans>,
            icon: (
                <Image className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: `/${lang}/photos`,
        },
        {
            title: <Trans>Contact</Trans>,
            icon: (
                <Contact className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: `/${lang}/contact`,
        }
    ];

    return (
        <footer className={'fixed flex bottom-5 left-1/2 -translate-x-1/2 z-20'}>
            <FloatingDock items={links} />
        </footer>
    )
}
