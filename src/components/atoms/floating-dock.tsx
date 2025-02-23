'use client'
import { cn } from '@/libs/utils'
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimation
} from 'framer-motion'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { PanelBottomClose, PanelBottomOpen } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger, Separator } from '@/components/atoms'

type LinkItem = {
  type: 'link'
  title: string | React.ReactNode
  icon: React.ReactNode
  href: string
}

type PopoverItem = {
  type: 'popover'
  title: string | React.ReactNode
  icon: React.ReactNode
  content: React.ReactNode
}

export type Item = PopoverItem | LinkItem | null

export const FloatingDock = ({
  items,
  selected,
  desktopClassName,
  mobileClassName
}: {
  items: Item[]
  desktopClassName?: string
  mobileClassName?: string
  selected?: string
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} selected={selected} className={desktopClassName} />
      <FloatingDockMobile items={items} selected={selected} className={mobileClassName} />
    </>
  )
}

const FloatingDockMobile = ({
  items,
  selected,
  className
}: {
  items: Item[]
  className?: string
  selected?: string
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('relative block md:hidden', className)}>
      <AnimatePresence>
        {open && (
          <motion.div layoutId='nav' className='absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2'>
            {items.map((item, idx) => {
              if (!item) {
                return <Separator className='w-10' key={idx} />
              }

              if (item.type === 'link') {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      transition: { delay: idx * 0.05 }
                    }}
                    transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                    className='relative'
                  >
                    <Link
                      target={item.href.startsWith('http') ? '_blank' : '_self'}
                      href={item.href}
                      className='h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center'
                    >
                      <div className='h-4 w-4'>{item.icon}</div>
                    </Link>
                    {selected === item.href && (
                      <div
                        style={{ width: 6, height: 6 }}
                        className='absolute -right-2 top-1/2 translate-y-[-50%] bg-gray-200 dark:bg-neutral-800 rounded-full'
                      />
                    )}
                  </motion.div>
                )
              } else if (item.type === 'popover') {
                return (
                  <Popover key={idx}>
                    <PopoverTrigger>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          y: 10,
                          transition: { delay: idx * 0.05 }
                        }}
                        transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                      >
                        <div className='h-4 w-4'>{item.icon}</div>
                      </motion.div>
                    </PopoverTrigger>
                    <PopoverContent>{item.content}</PopoverContent>
                  </Popover>
                )
              }
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className='h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center'
      >
        {open ? (
          <PanelBottomClose className='h-5 w-5 text-neutral-500 dark:text-neutral-400' />
        ) : (
          <PanelBottomOpen className='h-5 w-5 text-neutral-500 dark:text-neutral-400' />
        )}
      </button>
    </div>
  )
}

const FloatingDockDesktop = ({
  items,
  selected,
  className
}: {
  items: Item[]
  className?: string
  selected?: string
}) => {
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto hidden md:flex h-16 gap-4 items-end rounded-full bg-gray-50 dark:bg-neutral-900 px-4 pb-3',
        className
      )}
    >
      {items.map((item, idx) => {
        if (!item) {
          return <Separator className={'h-10'} key={idx} orientation={'vertical'} />
        }
        if (item.type === 'link') {
          return <LinkIconContainer mouseX={mouseX} selected={selected} key={idx} {...item} />
        } else if (item.type === 'popover') {
          return <PopoverIconContainer mouseX={mouseX} key={idx} {...item} />
        }
      })}
    </motion.div>
  )
}

function LinkIconContainer({
  selected,
  mouseX,
  title,
  icon,
  href
}: {
  mouseX: MotionValue
  title: string | React.ReactNode
  icon: React.ReactNode
  selected?: string
  href: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }

    return val - bounds.x - bounds.width / 2
  })

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40])
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40])

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20])
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20])

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  })
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  })

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  })
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  })

  const controls = useAnimation()
  const [hovered, setHovered] = useState(false)

  const handleTap = async () => {
    await controls.start({
      y: -50,
      transition: { duration: 0.15, ease: 'easeOut' }
    })
    await controls.start({
      y: 0,
      transition: { duration: 0.15, ease: 'easeIn' }
    })
  }

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        animate={controls}
        onTap={handleTap}
        whileTap={{ translateY: 10 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className='aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center relative'
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 2, x: '-50%' }}
              className='px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs'
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div style={{ width: widthIcon, height: heightIcon }} className='flex items-center justify-center'>
          {icon}
        </motion.div>
        {selected === href && (
          <div
            style={{ width: 6, height: 6 }}
            className='absolute -bottom-2 bg-gray-200 dark:bg-neutral-800 rounded-full'
          />
        )}
      </motion.div>
    </Link>
  )
}

function PopoverIconContainer({
  mouseX,
  title,
  icon,
  content
}: {
  mouseX: MotionValue
  title: string | React.ReactNode
  icon: React.ReactNode
  content: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }

    return val - bounds.x - bounds.width / 2
  })

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40])
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40])

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20])
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20])

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  })
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  })

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  })
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  })

  const [hovered, setHovered] = useState(false)

  return (
    <Popover>
      <PopoverTrigger>
        <motion.div
          ref={ref}
          style={{ width, height }}
          whileTap={{ translateY: 10 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className='aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center relative'
        >
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 2, x: '-50%' }}
                className='px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs'
              >
                {title}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div style={{ width: widthIcon, height: heightIcon }} className='flex items-center justify-center'>
            {icon}
          </motion.div>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  )
}
