'use client'

import { useMemo } from 'react'
import { Trans } from '@lingui/react/macro'
import { FloatingDock, Item } from '@/components/molecules'
import {
  Book,
  FileUser,
  FolderGit,
  GalleryHorizontal,
  Github,
  House,
  Linkedin,
  MonitorCog,
  Paperclip,
  Signature,
  Tags,
} from 'lucide-react'
import { Setting } from '@/components/molecules'
import { SITE_METADATA } from '@data/site-metadata'

type Props = {
  lang: string
}

export const Navbar = (props: Props) => {
  const { lang } = props
  const links: Item[] = useMemo(() => {
    return [
      {
        type: 'link',
        title: <Trans>Home</Trans>,
        icon: <House className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: `/${lang}`,
      },
      null,
      {
        type: 'link',
        title: <Trans>Blog</Trans>,
        icon: <Book className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: `/${lang}/blog`,
      },
      {
        type: 'link',
        title: <Trans>Tags</Trans>,
        icon: <Tags className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: `/${lang}/tags`,
      },
      {
        type: 'link',
        title: <Trans>Projects</Trans>,
        icon: <FolderGit className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: `/${lang}/projects`,
      },
      {
        type: 'link',
        title: <Trans>Photos</Trans>,
        icon: <GalleryHorizontal className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: `/${lang}/photos`,
      },
      {
        type: 'link',
        title: <Trans>About</Trans>,
        icon: <Signature className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: `/${lang}/about`,
      },
      {
        type: 'link',
        title: 'Resume',
        icon: <FileUser className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: SITE_METADATA.resume,
      },
      null,
      {
        type: 'link',
        title: 'LinkedIn',
        icon: <Linkedin className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: SITE_METADATA.linkedIn,
      },
      {
        type: 'link',
        title: 'Github',
        icon: <Github className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: SITE_METADATA.github,
      },
      {
        type: 'link',
        title: <Trans>Contact</Trans>,
        icon: <Paperclip className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        href: `/${lang}/contact`,
      },
      null,
      {
        type: 'popover',
        title: <Trans>Setting</Trans>,
        icon: <MonitorCog className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
        content: <Setting />,
      },
    ]
  }, [lang])

  return (
    <nav className={'fixed bottom-5 left-3 z-20 md:left-1/2 md:-translate-x-1/2'}>
      <div className={'animate-fade-in-scale'}>
        <FloatingDock items={links} />
      </div>
    </nav>
  )
}
