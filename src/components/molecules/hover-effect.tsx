'use client'
import { cn } from '@/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { ProjectCard } from '@/components/molecules/project-card'
import { type Project } from '@data/main'

export const HoverEffect = ({ items, className }: { items: Project[]; className?: string }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn('group/container bg-background grid grid-cols-1 my-10 md:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map((item, idx) => (
        <div
          key={item.title}
          className='group/effect relative block h-full w-full p-2'
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
          <ProjectCard project={item} />
        </div>
      ))}
    </div>
  )
}
