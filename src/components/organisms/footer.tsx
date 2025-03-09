import { cn } from '@/libs/utils'
import { Separator, SocialIcons, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atoms'
import { Dot } from 'lucide-react'
import { skillsData } from '@data/main'
import { useMemo } from 'react'
import type { Skill } from '@data/main'

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
      const skill = skillsData.find((skill) => skill.id === item)
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
    <footer className={cn('text-sm mt-8 flex flex-col gap-y-5', className)}>
      <Separator />
      {description && <p className='text-muted-foreground italic'>{description}</p>}
      <div className='flex flex-col md:flex-row justify-center md:justify-between items-center gap-4'>
        <ul className='flex items-center gap-x-1 flex-wrap justify-center'>
          <li>&copy; {new Date().getFullYear()}</li>
          <li>
            <Dot size={14} />
          </li>
          <li>{process.env.owner}</li>
          <li>
            <Dot size={14} />
          </li>
          <li>
            <SocialIcons kind={'gitfork'} size={5} href={'https://github.com/LVIPHU/portfolio'} />
          </li>
        </ul>
        <ul className='flex items-center gap-x-2 flex-wrap justify-center'>
          <li>Powered by</li>
          <li>
            <Dot size={14} />
          </li>
          {techsUsed}
        </ul>
      </div>
    </footer>
  )
}
