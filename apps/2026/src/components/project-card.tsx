import { Code, ExternalLink } from 'lucide-react'
import type { Locale, Project } from '@portfolio/content'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@portfolio/ui'
import { Badge } from '@portfolio/ui'
import { t } from '@/lib/utils'

export function ProjectCard({
  project,
  locale,
  demoLabel,
  sourceLabel,
}: {
  project: Project
  locale: Locale
  demoLabel: string
  sourceLabel: string
}) {
  return (
    <Card className='flex flex-col'>
      <CardHeader>
        <div className='flex items-baseline justify-between gap-2'>
          <CardTitle>{project.name}</CardTitle>
          <span className='text-muted-foreground text-xs'>{project.year}</span>
        </div>
        <CardDescription>{t(project.description, locale)}</CardDescription>
      </CardHeader>
      <CardContent className='mt-auto flex flex-col gap-4'>
        <div className='flex flex-wrap gap-1.5'>
          {project.tech.map((tech) => (
            <Badge key={tech} variant='secondary'>
              {tech}
            </Badge>
          ))}
        </div>
        {(project.links.demo || project.links.source) && (
          <div className='flex gap-4 text-sm'>
            {project.links.demo && (
              <a
                href={project.links.demo}
                target='_blank'
                rel='noreferrer'
                className='text-primary inline-flex items-center gap-1 hover:underline'
              >
                <ExternalLink className='h-3.5 w-3.5' /> {demoLabel}
              </a>
            )}
            {project.links.source && (
              <a
                href={project.links.source}
                target='_blank'
                rel='noreferrer'
                className='text-primary inline-flex items-center gap-1 hover:underline'
              >
                <Code className='h-3.5 w-3.5' /> {sourceLabel}
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
