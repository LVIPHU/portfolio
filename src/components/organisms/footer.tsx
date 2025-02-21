'use client'

import { motion } from "framer-motion";
import {Trans} from "@lingui/react/macro";
import {FloatingDock} from "@/components/atoms";
import {Contact, House, Image, Lightbulb} from "lucide-react";
import { usePathname } from 'next/navigation';
import {useMemo} from "react";
import {useMediaQuery} from "@/hooks";
import {cn} from "@/libs/utils";

type Props = {
    lang: string
}

export const Footer = (props: Props) => {
    const {lang} = props;
    const pathname = usePathname();
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const links = useMemo(() => {
      return [
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
    }, [lang]);

    return (
        <footer className={cn('fixed bottom-5 z-20', isDesktop ? 'left-1/2 -translate-x-1/2' : 'left-3')}>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                }}
            >
                <FloatingDock items={links} selected={pathname} />
            </motion.div>
        </footer>
    )
}
