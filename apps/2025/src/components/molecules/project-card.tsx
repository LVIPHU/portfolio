'use client'

import Image from 'next/image'
import { Button } from '@portfolio/ui'
import { Github, SocialIcons, type TypeOfIconsMap } from '@portfolio/icons'
import { NavigationLink } from '@/components/atoms'
import { Eye } from '@portfolio/icons/lucide'
import { type Project } from '@portfolio/content/data2025'
import useSWR from 'swr'
import { GithubRepository } from '@/types/github'
import { fetcher } from '@portfolio/utils'
import { useLocale, useTranslations } from 'next-intl'

interface ProjectCardProps {
  project: Project
}

/** `/api/github` yêu cầu `owner/repo` (owner whitelist LVIPHU). */
function githubRepoParam(source?: string): string | null {
  if (!source) return null
  const match = source.match(/github\.com\/([^/]+\/[^/?#]+)/i)
  const repo = match?.[1]?.replace(/\.git$/, '')
  return repo ?? null
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { name, description, image, tech, links, slug } = project
  const repo = githubRepoParam(links.source)
  const { data: repository } = useSWR<GithubRepository>(repo ? `/api/github?repo=${repo}` : null, fetcher)
  const href = repository?.url ?? links.source
  const lang = repository?.languages?.[0]
  const t = useTranslations()
  const locale = useLocale() as 'vi' | 'en'
  return (
    <div className='border-primary/20 group-hover/effect:!border-accent relative z-10 flex h-full flex-col overflow-hidden rounded-xl border transition-all group-hover/container:border-transparent'>
      <div className='bg-accent relative h-64 overflow-hidden'>
        {image ? (
          <Image
            src={image}
            alt={name}
            className='object-cover transition-transform duration-300 hover:scale-105'
            fill
          />
        ) : (
          <div className='bg-muted text-muted-foreground flex h-full items-center justify-center text-sm'>{slug}</div>
        )}
      </div>

      <div className='flex flex-1 flex-col p-6'>
        <h3 className='mb-2 text-xl font-semibold tracking-wide'>{name}</h3>
        <p className='text-muted-foreground mb-4 tracking-wide'>{description[locale] ?? description.vi}</p>

        {tech.length > 0 && (
          <div className='mb-6 space-y-1.5'>
            <div className='text-xs text-gray-600 dark:text-gray-400'>{t('ProjectCard.stack')}</div>
            <div className='flex flex-wrap gap-2'>
              {tech.map((id) => (
                <SocialIcons key={id} kind={id as TypeOfIconsMap} iconType='icon' size={16} />
              ))}
            </div>
          </div>
        )}

        <div className='mt-auto flex items-center justify-between'>
          <div className='flex gap-3'>
            {links.demo && (
              <Button variant='default' className='rounded-full' render={<NavigationLink href={links.demo} />}>
                {t('ProjectCard.website')}
                <Eye className='ml-1 h-4 w-4' />
              </Button>
            )}
            {href && (
              <Button variant='outline' className='rounded-full shadow-none' render={<NavigationLink href={href} />}>
                {t('ProjectCard.viewCode')}
                <Github className='ml-1 h-4 w-4' />
              </Button>
            )}
          </div>

          {lang && (
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-600 dark:text-gray-400'>{t('Common.language')}</div>
              <div className='flex items-center gap-1.5'>
                <SocialIcons kind={lang.name.toLowerCase() as TypeOfIconsMap} iconType='icon' size={16} />
                <span className='font-medium'>{lang.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
