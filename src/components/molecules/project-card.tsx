import Image from 'next/image'
import { Badge, Button, NavigationLink } from '@/components/atoms'
import { Github } from 'lucide-react'
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
        <div className='mb-6 flex flex-wrap gap-2'>
          {technologies.map((tech) => (
            <Badge key={tech}>
              {tech}
            </Badge>
          ))}
        </div>
        {/* Actions */}
        <div className='mt-auto flex gap-3'>
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
