import { useMemo } from 'react'
import { cn } from '@/utils'
import {
  Container,
  Separator,
  SocialIcons,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/atoms'
import { Dot } from 'lucide-react'
import { type Skill, SKILLS } from '@data/main'
import { SITE_METADATA } from '@data/site-metadata'

const techs = ['typescript', 'nextjs', 'react', 'tailwindcss', 'shadcn']

const TooltipLink = ({ item }: { item: Skill }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <SocialIcons kind={item.id} size={5} href={item.href} />
      </TooltipTrigger>
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
  const techsUsed = useMemo(() => {
    return techs.map((item) => {
      const skill = SKILLS.find((skill) => skill.id === item)
      if (skill) {
        return (
          <li key={item}>
            <TooltipLink item={skill} />
          </li>
        )
      }
    })
  }, [])

  return (
    <Container as={'footer'} className={cn('mb-4 mt-8 flex flex-col gap-y-5 text-sm md:mb-32 md:mt-16', className)}>
      <Separator />
      {description && <p className='italic text-muted-foreground'>{description}</p>}
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
            <SocialIcons kind={'gitfork'} size={5} href={'https://github.com/LVIPHU/portfolio'} />
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
