'use client'
import { cn } from '@/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { ProjectCard } from '@/components/molecules/project-card'
import { type Project } from '@data/main'
import { AnimatedContent } from '@/components/atoms'

export const HoverEffect = ({ items, className }: { items: Project[]; className?: string }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div
      className={cn(
        'group/container grid grid-cols-1 gap-2 bg-background md:gap-5 lg:grid-cols-2 xl:grid-cols-3',
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.title}
          className='group/effect relative block h-full w-full p-1.5 md:p-2.5'
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode={'wait'}>
            {hoveredIndex === idx && (
              <motion.span
                key={`hover-${idx}`}
                className='absolute inset-0 block h-full w-full rounded-2xl bg-neutral-200 dark:bg-slate-800/[0.8]'
                layoutId='hoverBackground'
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: {
                    duration: 0.3,
                    ease: 'easeIn',
                  },
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.3,
                    delay: 0.6,
                    ease: 'easeOut',
                  },
                }}
              />
            )}
          </AnimatePresence>
          <AnimatedContent className={'h-full'} direction={'horizontal'} reverse={true} delay={idx * 0.1}>
            <ProjectCard project={item} />
          </AnimatedContent>
        </div>
      ))}
    </div>
  )
}
