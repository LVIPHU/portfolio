import Image from 'next/image'
import { Badge, Button, NavigationLink } from '@/components/atoms'
import { Github } from 'lucide-react'
import { type Project } from '@data/main'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { title, description, image, technologies, url, repo } = project
  return (
    <div className='group relative flex flex-col overflow-hidden rounded-xl border border-accent transition-all hover:border-primary/50'>
      <div className='relative h-64 overflow-hidden bg-accent'>
        <Image
          src={image}
          alt={title}
          className='object-cover transition-transform duration-300 group-hover:scale-105'
          fill
        />
      </div>

      {/* Content */}
      <div className='flex-1 flex flex-col p-6'>
        <h3 className='text-xl font-semibold mb-2'>{title}</h3>
        <p className='text-muted-foreground mb-4'>{description}</p>

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
          {repo && (
            <Button variant='outline' className='rounded-full shadow-none' asChild>
              <NavigationLink href={repo}>
                <Github className='mr-1 h-4 w-4' />
                View Code
              </NavigationLink>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
