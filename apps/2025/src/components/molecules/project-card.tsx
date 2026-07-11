'use client'

import Image from 'next/image'
import { Button, NavigationLink, SocialIcons, TypeOfIconsMap } from '@/components/atoms'
import { Eye, Github } from 'lucide-react'
import { type Project2025 as Project } from '@portfolio/content/data2025'
import useSWR from 'swr'
import { GithubRepository } from '@/types/github'
import { fetcher } from '@/utils'
import { useLocale, useTranslations } from 'next-intl'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { title, description, image, technologies, url, repo } = project
  const { data: repository } = useSWR<GithubRepository>(`/api/github?repo=${repo}`, fetcher)
  const href = repository?.url
  const lang = repository?.languages?.[0]
  const t = useTranslations()
  const locale = useLocale() as 'vi' | 'en'
  return (
    <div className='border-primary/20 group-hover/effect:!border-accent relative z-10 flex h-full flex-col overflow-hidden rounded-xl border transition-all group-hover/container:border-transparent'>
      <div className='bg-accent relative h-64 overflow-hidden'>
        <Image
          src={image}
          alt={title}
          className='object-cover transition-transform duration-300 hover:scale-105'
          fill
        />
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col p-6'>
        <h3 className='mb-2 text-xl font-semibold tracking-wide'>{title}</h3>
        <p className='text-muted-foreground mb-4 tracking-wide'>
          {typeof description === 'string' ? description : description ? (description[locale] ?? description.vi) : ''}
        </p>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className='mb-6 space-y-1.5'>
            <div className='text-xs text-gray-600 dark:text-gray-400'>{t('ProjectCard.stack')}</div>
            <div className='flex flex-wrap gap-2'>
              {technologies.map((tech) => (
                <SocialIcons key={tech} kind={tech as TypeOfIconsMap} iconType='icon' className='h-4 w-4' />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className='mt-auto flex items-center justify-between'>
          <div className='flex gap-3'>
            {url && (
              <Button variant='default' className='rounded-full' asChild>
                <NavigationLink href={url}>
                  {t('ProjectCard.website')}
                  <Eye className='ml-1 h-4 w-4' />
                </NavigationLink>
              </Button>
            )}
            {href && (
              <Button variant='outline' className='rounded-full shadow-none' asChild>
                <NavigationLink href={href}>
                  {t('ProjectCard.viewCode')}
                  <Github className='ml-1 h-4 w-4' />
                </NavigationLink>
              </Button>
            )}
          </div>

          {lang && (
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-600 dark:text-gray-400'>{t('Common.language')}</div>
              <div className='flex items-center gap-1.5'>
                <SocialIcons kind={lang.name.toLowerCase() as TypeOfIconsMap} iconType='icon' className='h-4 w-4' />
                <span className='font-medium'>{lang.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
