'use client'
import { cn } from '@/utils'
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimation,
} from 'framer-motion'
import { useRef, useState } from 'react'
import { PanelBottomClose, PanelBottomOpen } from 'lucide-react'
import { NavigationLink, Popover, PopoverContent, PopoverTrigger, Separator } from '@/components/atoms'
import { usePathname } from 'next/navigation'

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
  desktopClassName,
  mobileClassName,
}: {
  items: Item[]
  desktopClassName?: string
  mobileClassName?: string
  selected?: string
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  )
}

const FloatingDockMobile = ({ items, className }: { items: Item[]; className?: string }) => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('relative block md:hidden', className)}>
      <AnimatePresence>
        {open && (
          <motion.div layoutId='nav' className='absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2'>
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
                      transition: { delay: idx * 0.05 },
                    }}
                    transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                    className='relative'
                  >
                    <NavigationLink
                      href={item.href}
                      className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900'
                    >
                      <div className='h-4 w-4'>{item.icon}</div>
                    </NavigationLink>
                    {pathname === item.href && (
                      <div
                        style={{ width: 6, height: 6 }}
                        className='absolute -right-2 top-1/2 translate-y-[-50%] rounded-full bg-gray-200 dark:bg-neutral-800'
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
                          transition: { delay: idx * 0.05 },
                        }}
                        transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                      >
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900'>
                          <div className='h-4 w-4'>{item.icon}</div>
                        </div>
                      </motion.div>
                    </PopoverTrigger>
                    <PopoverContent className={'w-80'}>{item.content}</PopoverContent>
                  </Popover>
                )
              }
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800'
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

const FloatingDockDesktop = ({ items, className }: { items: Item[]; className?: string }) => {
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto hidden h-16 items-end gap-4 rounded-full bg-gray-50/70 px-4 pb-3 backdrop-blur dark:bg-neutral-900/75 md:flex',
        className
      )}
    >
      {items.map((item, idx) => {
        if (!item) {
          return <Separator className={'h-10'} key={idx} orientation={'vertical'} />
        }
        if (item.type === 'link') {
          return <LinkIconContainer mouseX={mouseX} key={idx} {...item} />
        } else if (item.type === 'popover') {
          return <PopoverIconContainer mouseX={mouseX} key={idx} {...item} />
        }
      })}
    </motion.div>
  )
}

function LinkIconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue
  title: string | React.ReactNode
  icon: React.ReactNode
  href: string
}) {
  const pathname = usePathname()
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
    damping: 12,
  })
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  const controls = useAnimation()
  const [hovered, setHovered] = useState(false)

  const handleTap = async () => {
    await controls.start({
      y: -50,
      transition: { duration: 0.15, ease: 'easeOut' },
    })
    await controls.start({
      y: 0,
      transition: { duration: 0.15, ease: 'easeIn' },
    })
  }

  return (
    <NavigationLink href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        animate={controls}
        onTap={handleTap}
        whileTap={{ translateY: 10 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className='relative flex aspect-square items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800'
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 2, x: '-50%' }}
              className='absolute -top-8 left-1/2 w-fit -translate-x-1/2 whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white'
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div style={{ width: widthIcon, height: heightIcon }} className='flex items-center justify-center'>
          {icon}
        </motion.div>
        {pathname === href && (
          <div
            style={{ width: 6, height: 6 }}
            className='absolute -bottom-2 rounded-full bg-gray-200 dark:bg-neutral-800'
          />
        )}
      </motion.div>
    </NavigationLink>
  )
}

function PopoverIconContainer({
  mouseX,
  title,
  icon,
  content,
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
    damping: 12,
  })
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
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
          className='relative flex aspect-square items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800'
        >
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 2, x: '-50%' }}
                className='absolute -top-8 left-1/2 w-fit -translate-x-1/2 whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white'
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
      <PopoverContent className={'w-80'}>{content}</PopoverContent>
    </Popover>
  )
}
