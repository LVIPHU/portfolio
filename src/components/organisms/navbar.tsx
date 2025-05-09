'use client'

import { useMemo } from 'react'
import { Trans } from '@lingui/react/macro'
import { FloatingDock, Item } from '@/components/molecules'
import {
  Book,
  Command,
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
import { useKBar } from 'kbar'

type Props = {
  lang: string
}

const ICON_CLASS = 'h-full w-full text-neutral-500 dark:text-neutral-300'

export const Navbar = ({ lang }: Props) => {
  const { query } = useKBar()
  const links: Item[] = useMemo(() => {
    return [
      {
        type: 'link',
        title: <Trans>Home</Trans>,
        icon: <House className={ICON_CLASS} />,
        href: `/${lang}`,
      },
      null,
      {
        type: 'link',
        title: <Trans>Blog</Trans>,
        icon: <Book className={ICON_CLASS} />,
        href: `/${lang}/blog`,
      },
      {
        type: 'link',
        title: <Trans>Tags</Trans>,
        icon: <Tags className={ICON_CLASS} />,
        href: `/${lang}/tags`,
      },
      {
        type: 'link',
        title: <Trans>Projects</Trans>,
        icon: <FolderGit className={ICON_CLASS} />,
        href: `/${lang}/projects`,
      },
      {
        type: 'link',
        title: <Trans>Photos</Trans>,
        icon: <GalleryHorizontal className={ICON_CLASS} />,
        href: `/${lang}/photos`,
      },
      {
        type: 'link',
        title: <Trans>About</Trans>,
        icon: <Signature className={ICON_CLASS} />,
        href: `/${lang}/about`,
      },
      {
        type: 'link',
        title: 'Resume',
        icon: <FileUser className={ICON_CLASS} />,
        href: SITE_METADATA.resume,
      },
      null,
      {
        type: 'link',
        title: 'LinkedIn',
        icon: <Linkedin className={ICON_CLASS} />,
        href: SITE_METADATA.linkedIn,
      },
      {
        type: 'link',
        title: 'Github',
        icon: <Github className={ICON_CLASS} />,
        href: SITE_METADATA.github,
      },
      {
        type: 'link',
        title: <Trans>Contact</Trans>,
        icon: <Paperclip className={ICON_CLASS} />,
        href: `/${lang}/contact`,
      },
      null,
      {
        type: 'action',
        title: <Trans>Search</Trans>,
        icon: <Command className={ICON_CLASS} />,
        onClick: () => query.toggle(),
      },
      {
        type: 'popover',
        title: <Trans>Setting</Trans>,
        icon: <MonitorCog className={ICON_CLASS} />,
        content: <Setting />,
      },
    ]
    // eslint-disable-next-line
  }, [lang])

  return (
    <nav className={'fixed bottom-5 left-3 z-20 md:left-1/2 md:-translate-x-1/2'}>
      <div className={'animate-fade-in-scale'}>
        <FloatingDock items={links} />
      </div>
    </nav>
  )
}
