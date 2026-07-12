'use client'

import { useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { FloatingDock, Item } from '@/components/molecules'
import {
  Book,
  Command,
  FileUser,
  FolderGit,
  GalleryHorizontal,
  House,
  MonitorCog,
  Paperclip,
  Signature,
  Tags,
} from 'lucide-react'
import { Github, Linkedin } from '@/utils'
import { Setting } from '@/components/molecules'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { useKBar } from 'kbar'

type Props = {
  /** Không còn dùng sau C6 — Link/pathname đã locale-aware qua @/i18n/navigation */
  lang?: string
}

const ICON_CLASS = 'h-full w-full text-neutral-500 dark:text-neutral-300'

export const Navbar = (_props: Props) => {
  const t = useTranslations()
  const { query } = useKBar()
  const toggleSearch = useCallback(() => query.toggle(), [query])

  const links: Item[] = useMemo(() => {
    return [
      {
        type: 'link',
        title: t('Navbar.home'),
        icon: <House className={ICON_CLASS} />,
        href: '/',
      },
      null,
      {
        type: 'link',
        title: t('Common.blog'),
        icon: <Book className={ICON_CLASS} />,
        href: '/blog',
      },
      {
        type: 'link',
        title: t('Common.tags'),
        icon: <Tags className={ICON_CLASS} />,
        href: '/tags',
      },
      {
        type: 'link',
        title: t('Common.projects'),
        icon: <FolderGit className={ICON_CLASS} />,
        href: '/projects',
      },
      {
        type: 'link',
        title: t('Common.photos'),
        icon: <GalleryHorizontal className={ICON_CLASS} />,
        href: '/photos',
      },
      {
        type: 'link',
        title: t('Common.about'),
        icon: <Signature className={ICON_CLASS} />,
        href: '/about',
      },
      {
        type: 'link',
        title: t('Common.resume'),
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
        title: t('Common.contact'),
        icon: <Paperclip className={ICON_CLASS} />,
        href: '/contact',
      },
      null,
      {
        type: 'action',
        title: t('Navbar.search'),
        icon: <Command className={ICON_CLASS} />,
        onClick: toggleSearch,
      },
      {
        type: 'popover',
        title: t('Common.setting'),
        icon: <MonitorCog className={ICON_CLASS} />,
        content: <Setting />,
      },
    ]
  }, [t, toggleSearch])

  return (
    <nav className={'fixed bottom-5 left-3 z-20 md:left-1/2 md:-translate-x-1/2'}>
      <div className={'animate-fade-in-scale'}>
        <FloatingDock items={links} />
      </div>
    </nav>
  )
}
