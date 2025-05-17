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
import { memo, useRef, useState, ReactNode, useEffect, useLayoutEffect } from 'react'
import { PanelBottomClose, PanelBottomOpen } from 'lucide-react'
import { NavigationLink, Popover, PopoverContent, PopoverTrigger, Separator } from '@/components/atoms'
import { usePathname } from 'next/navigation'

type BaseItem = {
  type: 'link' | 'popover' | 'action'
  title: string | ReactNode
  icon: ReactNode
}

type LinkItem = BaseItem & { type: 'link'; href: string }
type ActionItem = BaseItem & { type: 'action'; onClick: () => void }
type PopoverItem = BaseItem & { type: 'popover'; content: ReactNode }
export type Item = LinkItem | ActionItem | PopoverItem | null

const SPRING_CONFIG = { mass: 0.1, stiffness: 150, damping: 12 }
const DISTANCE_RANGE = [-150, 0, 150]
const SIZE_RANGE = [40, 80, 40]
const ICON_RANGE = [20, 40, 20]

export const FloatingDock = memo(function FloatingDock({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: Item[]
  desktopClassName?: string
  mobileClassName?: string
}) {
  return (
    <>
      <DesktopDock items={items} className={desktopClassName} />
      <MobileDock items={items} className={mobileClassName} />
    </>
  )
})

function MobileDock({ items, className }: { items: Item[]; className?: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn('relative block md:hidden', className)}>
      <AnimatePresence>
        {open && (
          <motion.div layoutId='nav' className='absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2'>
            {items.map((item, idx) => (
              <MobileItem key={idx} item={item} pathname={pathname} delayIndex={idx} total={items.length} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800'
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

function DesktopDock({ items, className }: { items: Item[]; className?: string }) {
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
      {items.map((item, idx) => (
        <DesktopItem key={idx} item={item} mouseX={mouseX} />
      ))}
    </motion.div>
  )
}

function MobileItem({
  item,
  pathname,
  delayIndex,
  total,
}: {
  item: Item
  pathname: string
  delayIndex: number
  total: number
}) {
  const common = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10, transition: { delay: delayIndex * 0.05 } },
    transition: { delay: (total - 1 - delayIndex) * 0.05 },
    className: 'relative',
  }

  if (!item)
    return (
      <motion.div {...common}>
        <Separator className='w-10' />
      </motion.div>
    )
  if (item.type === 'link') {
    return (
      <motion.div {...common}>
        <NavigationLink
          href={item.href}
          className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800'
        >
          <div className='h-4 w-4'>{item.icon}</div>
        </NavigationLink>
        {pathname === item.href && <IndicatorMobile />}
      </motion.div>
    )
  }
  if (item.type === 'popover') {
    return (
      <Popover>
        <PopoverTrigger>
          <motion.div {...common}>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800'>
              <div className='h-4 w-4'>{item.icon}</div>
            </div>
          </motion.div>
        </PopoverTrigger>
        <PopoverContent className='w-80'>{item.content}</PopoverContent>
      </Popover>
    )
  }
  return (
    <motion.div {...common} onClick={item.onClick}>
      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800'>
        <div className='h-4 w-4'>{item.icon}</div>
      </div>
    </motion.div>
  )
}

function IndicatorMobile() {
  return (
    <div
      style={{ width: 6, height: 6 }}
      className='absolute -right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-200 dark:bg-neutral-800'
    />
  )
}

function DesktopItem({ item, mouseX }: { item: Item; mouseX: MotionValue }) {
  if (!item) return <Separator className='h-10' orientation='vertical' />
  return (
    <IconContainer
      mouseX={mouseX}
      title={item.title}
      icon={item.icon}
      href={item.type === 'link' ? item.href : undefined}
      content={item.type === 'popover' ? item.content : undefined}
      onClick={item.type === 'action' ? item.onClick : undefined}
    />
  )
}

type IconProps = {
  mouseX: MotionValue
  title: string | ReactNode
  icon: ReactNode
  href?: string
  content?: ReactNode
  onClick?: () => void
}

function IconContainer({ mouseX, title, icon, href, content, onClick }: IconProps) {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const controls = useAnimation()
  const [hovered, setHovered] = useState(false)
  const boundsRef = useRef({ x: 0, width: 0 })

  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      boundsRef.current = { x: rect.x, width: rect.width }
    }
  }, [])

  const distance = useTransform(mouseX, (val) => {
    return val - boundsRef.current.x - boundsRef.current.width / 2
  })

  const width = useSpring(useTransform(distance, DISTANCE_RANGE, SIZE_RANGE), SPRING_CONFIG)
  const height = useSpring(useTransform(distance, DISTANCE_RANGE, SIZE_RANGE), SPRING_CONFIG)
  const widthIcon = useSpring(useTransform(distance, DISTANCE_RANGE, ICON_RANGE), SPRING_CONFIG)
  const heightIcon = useSpring(useTransform(distance, DISTANCE_RANGE, ICON_RANGE), SPRING_CONFIG)

  const handleTap = async () => {
    await controls.start({ y: -50, transition: { duration: 0.15, ease: 'easeOut' } })
    await controls.start({ y: 0, transition: { duration: 0.15, ease: 'easeIn' } })
  }

  const Container = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      animate={controls}
      onTap={handleTap}
      whileTap={{ translateY: 10 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className='relative flex aspect-square items-center justify-center rounded-full bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800'
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
      {href && pathname === href && <IndicatorDesktop />}
    </motion.div>
  )

  if (content) {
    return (
      <Popover>
        <PopoverTrigger>{Container}</PopoverTrigger>
        <PopoverContent className='w-80'>{content}</PopoverContent>
      </Popover>
    )
  }

  return href ? <NavigationLink href={href}>{Container}</NavigationLink> : Container
}

function IndicatorDesktop() {
  return (
    <div style={{ width: 6, height: 6 }} className='absolute -bottom-2 rounded-full bg-gray-200 dark:bg-neutral-800' />
  )
}
