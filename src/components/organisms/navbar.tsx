'use client'

import { motion } from 'framer-motion'
import { Trans } from '@lingui/react/macro'
import { FloatingDock, Item } from '@/components/atoms'
import { Facebook, Github, House, Image, Lightbulb, MonitorCog, Paperclip, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { Setting } from '@/components/molecules'

type Props = {
  lang: string
}

export const Navbar = (props: Props) => {
  const { lang } = props
  const pathname = usePathname()
  const links: Item[] = useMemo(() => {
    return [
      {
        type: 'link',
        title: <Trans>Home</Trans>,
        icon: <House className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: `/${lang}`
      },
      null,
      {
        type: 'link',
        title: <Trans>About</Trans>,
        icon: <User className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: `/${lang}/about`
      },
      {
        type: 'link',
        title: <Trans>Projects</Trans>,
        icon: <Lightbulb className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: `/${lang}/projects`
      },
      {
        type: 'link',
        title: <Trans>Photos</Trans>,
        icon: <Image className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: `/${lang}/photos`
      },
      null,
      {
        type: 'link',
        title: <Trans>Facebook</Trans>,
        icon: <Facebook className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: `https://www.facebook.com/phuphu.phang.54`
      },
      {
        type: 'link',
        title: <Trans>Github</Trans>,
        icon: <Github className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: `https://github.com/LVIPHU`
      },
      {
        type: 'link',
        title: <Trans>Contact</Trans>,
        icon: <Paperclip className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: `/${lang}/contact`
      },
      null,
      {
        type: 'popover',
        title: <Trans>Setting</Trans>,
        icon: <MonitorCog className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        content: <Setting />
      }
    ]
  }, [lang])

  return (
    <nav className={'fixed bottom-5 z-20 left-3 md:left-1/2 md:-translate-x-1/2'}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
        }}
      >
        <FloatingDock items={links} selected={pathname} />
      </motion.div>
    </nav>
  )
}
