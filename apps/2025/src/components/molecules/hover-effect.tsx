'use client'
import { cn } from '@/utils'
import { ProjectCard } from '@/components/molecules/project-card'
import { type Project2025 as Project } from '@portfolio/content/data2025'
import { Reveal } from '@/components/atoms'
import { HoverHighlight } from '@portfolio/ui/motion'

// C9 (M-02 #6): highlight bám card bằng HoverHighlight (gsap.to đo rect), thay
// framer layoutId shared-layout. Giữ nguyên markup card + Reveal.
export const HoverEffect = ({ items, className }: { items: Project[]; className?: string }) => {
  return (
    <HoverHighlight
      className={cn(
        'group/container bg-background grid grid-cols-1 gap-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3',
        className
      )}
      highlightClassName='rounded-2xl bg-neutral-200 dark:bg-slate-800/[0.8]'
    >
      {items.map((item, idx) => (
        <div key={item.title} data-hover-item className='group/effect relative block h-full w-full p-1.5 md:p-2.5'>
          <Reveal className={'h-full'} direction={'horizontal'} reverse={true} delay={idx * 0.1}>
            <ProjectCard project={item} />
          </Reveal>
        </div>
      ))}
    </HoverHighlight>
  )
}
