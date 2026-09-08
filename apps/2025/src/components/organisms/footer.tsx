'use client'

import { Separator, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@portfolio/ui'
import { SocialIcons } from '@portfolio/icons'
import { cn } from '@portfolio/utils'
import { Container, NavigationLink } from '@/components/atoms'
import { GitFork, Dot } from '@portfolio/icons/lucide'
import { type Skill2025 as Skill, SKILLS_2025 as SKILLS } from '@portfolio/content/data2025'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { useTranslations } from 'next-intl'

const techs = ['typescript', 'nextjs', 'react', 'tailwindcss', 'shadcn']

const TooltipLink = ({ item }: { item: Skill }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger render={<SocialIcons kind={item.id} size={20} href={item.href} />} />
      <TooltipContent>
        <p>{item.name}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

type Props = {
  description?: string
  className?: string
}

export const Footer = ({ className, description }: Props) => {
  const t = useTranslations()
  const techsUsed = techs.map((item) => {
    const skill = SKILLS.find((s) => s.id === item)
    if (skill) {
      return (
        <li key={item}>
          <TooltipLink item={skill} />
        </li>
      )
    }
  })

  return (
    <Container as={'footer'} className={cn('mb-4 mt-8 flex flex-col gap-y-5 text-sm md:mb-32 md:mt-16', className)}>
      <Separator />
      {description && <p className='text-muted-foreground italic'>{description}</p>}
      <div className='flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between'>
        <ul className='flex flex-wrap items-center justify-center gap-x-1'>
          <li>&copy; {new Date().getFullYear()}</li>
          <li>
            <Dot size={14} />
          </li>
          <li>{SITE_METADATA.author}</li>
          <li>
            <Dot size={14} />
          </li>
          <li>
            <a
              href='https://github.com/LVIPHU/portfolio'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-center hover:text-sky-900 dark:hover:text-sky-900'
            >
              <span className='sr-only'>GitHub</span>
              <GitFork size={20} />
            </a>
          </li>
          <li>
            <Dot size={14} />
          </li>
          <li>
            <NavigationLink href='/privacy' className='hover:underline'>
              {t('Common.privacy')}
            </NavigationLink>
          </li>
        </ul>
        <ul className='flex flex-wrap items-center justify-center gap-x-2'>
          <li>Powered by</li>
          <li>
            <Dot size={14} />
          </li>
          {techsUsed}
        </ul>
      </div>
    </Container>
  )
}
