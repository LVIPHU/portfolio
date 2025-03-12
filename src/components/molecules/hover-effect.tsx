'use client'
import { cn } from '@/libs/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { ProjectCard } from '@/components/molecules/project-card'
import { type Project } from '@data/main'

export const HoverEffect = ({ items, className }: { items: Project[]; className?: string }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn('group/container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  py-10', className)}>
      {items.map((item, idx) => (
        <div
          key={item.title}
          className='relative group/effect block p-2 h-full w-full'
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode={'wait'}>
            {hoveredIndex === idx && (
              <motion.span
                key={`hover-${idx}`}
                className='absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-2xl'
                layoutId='hoverBackground'
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: {
                    duration: 0.3,
                    ease: 'easeIn'
                  }
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.3,
                    delay: 0.6,
                    ease: 'easeOut'
                  }
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
