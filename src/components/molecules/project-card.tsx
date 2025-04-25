'use client'

import Image from 'next/image'
import { Button, NavigationLink, SocialIcons, TypeOfIconsMap } from '@/components/atoms'
import { Eye, Github } from 'lucide-react'
import { type Project } from '@data/main'
import useSWR from 'swr'
import { GithubRepository } from '@/types/github'
import { fetcher } from '@/utils'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { title, description, image, technologies, url, repo } = project
  const { data: repository } = useSWR<GithubRepository>(`/api/github?repo=${repo}`, fetcher)
  const href = repository?.url
  const lang = repository?.languages?.[0]
  return (
    <div className='relative z-10 flex h-full flex-col overflow-hidden rounded-xl border border-card transition-all group-hover/container:border-transparent group-hover/effect:!border-accent'>
      <div className='relative h-64 overflow-hidden bg-accent'>
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
        <p className='mb-4 tracking-wide text-muted-foreground'>{description}</p>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className='mb-6 space-y-1.5'>
            <div className='text-xs text-gray-600 dark:text-gray-400'>Stack</div>
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
                  Website
                  <Eye className='ml-1 h-4 w-4' />
                </NavigationLink>
              </Button>
            )}
            {href && (
              <Button variant='outline' className='rounded-full shadow-none' asChild>
                <NavigationLink href={href}>
                  View Code
                  <Github className='ml-1 h-4 w-4' />
                </NavigationLink>
              </Button>
            )}
          </div>

          {lang && (
            <div className='space-y-1.5'>
              <div className='text-xs text-gray-600 dark:text-gray-400'>Language</div>
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
