import Image from 'next/image'
import { Badge, Button, NavigationLink } from '@/components/atoms'
import { Github } from 'lucide-react'
import { type Project } from '@data/main'
import useSWR from 'swr'
import { GithubRepository } from '@/types/github'
import { fetcher } from '@/libs/utils'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { title, description, image, technologies, url, repo } = project
  const { data: repository } = useSWR<GithubRepository>(`/api/github?repo=${repo}`, fetcher)
  const href = repository?.url
  const lang = repository?.languages?.[0]
  return (
    <div className='h-full relative flex flex-col overflow-hidden rounded-xl border border-primary/50 group-hover/container:border-transparent group-hover/effect:!border-accent transition-all z-20'>
      <div className='relative h-64 overflow-hidden bg-accent'>
        <Image
          src={image}
          alt={title}
          className='object-cover transition-transform duration-300 hover:scale-105'
          fill
        />
      </div>

      {/* Content */}
      <div className='flex-1 flex flex-col p-6'>
        <h3 className='text-xl font-semibold tracking-wide mb-2'>{title}</h3>
        <p className='text-muted-foreground tracking-wide mb-4'>{description}</p>

        {/* Technologies */}
        <div className='flex flex-wrap gap-2 mb-6'>
          {technologies.map((tech) => (
            <Badge key={tech} variant='secondary' className='rounded-full'>
              {tech}
            </Badge>
          ))}
        </div>
        {/* Actions */}
        <div className='flex gap-3 mt-auto'>
          {url && (
            <Button variant='default' className='rounded-full' asChild>
              <NavigationLink href={url}>
                <Github className='mr-1 h-4 w-4' />
                liveUrl
              </NavigationLink>
            </Button>
          )}
          {href && (
            <Button variant='outline' className='rounded-full shadow-none' asChild>
              <NavigationLink href={href}>
                <Github className='mr-1 h-4 w-4' />
                View Code
              </NavigationLink>
            </Button>
          )}
          {lang && <p>{lang.name}</p>}
        </div>
      </div>
    </div>
  )
}
