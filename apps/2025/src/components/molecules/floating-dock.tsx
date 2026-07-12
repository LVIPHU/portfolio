'use client'
import { cn } from '@/utils'
import { memo, useState, type CSSProperties, type ReactNode } from 'react'
import { PanelBottomClose, PanelBottomOpen } from 'lucide-react'
import { NavigationLink, Popover, PopoverContent, PopoverTrigger, Separator } from '@/components/atoms'
import { useMagnify } from '@portfolio/ui/motion'
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

// C9 (M-02 #8, D-06/D-07): dock bỏ lib animation cũ hoàn toàn — magnify bằng
// useMagnify (gsap.quickTo), tooltip + tap bằng CSS, panel mobile fade-in stagger
// bằng CSS. Số magnify giữ đúng bản cũ (radius 150, 40↔80, icon 20↔40).
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
      {open && (
        <div className='absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2'>
          {items.map((item, idx) => (
            <MobileItem key={idx} item={item} pathname={pathname} delayIndex={items.length - 1 - idx} />
          ))}
        </div>
      )}
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
  const { dockRef, onMouseEnter, onMouseMove, onMouseLeave } = useMagnify()

  return (
    <div
      ref={dockRef}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        'mx-auto hidden h-16 items-end gap-4 rounded-full bg-gray-50/70 px-4 pb-3 backdrop-blur md:flex dark:bg-neutral-900/75',
        className
      )}
    >
      {items.map((item, idx) => (
        <DesktopItem key={idx} item={item} />
      ))}
    </div>
  )
}

function MobileItem({ item, pathname, delayIndex }: { item: Item; pathname: string; delayIndex: number }) {
  const style = { '--i': delayIndex } as CSSProperties
  if (!item)
    return (
      <div className='fade-in-up relative' style={style}>
        <Separator className='w-10' />
      </div>
    )
  if (item.type === 'link') {
    return (
      <div className='fade-in-up relative' style={style}>
        <NavigationLink
          href={item.href}
          className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800'
        >
          <div className='h-4 w-4'>{item.icon}</div>
        </NavigationLink>
        {pathname === item.href && <IndicatorMobile />}
      </div>
    )
  }
  if (item.type === 'popover') {
    return (
      <Popover>
        <PopoverTrigger>
          <div className='fade-in-up relative' style={style}>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800'>
              <div className='h-4 w-4'>{item.icon}</div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-80'>{item.content}</PopoverContent>
      </Popover>
    )
  }
  return (
    <div className='fade-in-up relative' style={style} onClick={item.onClick}>
      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800'>
        <div className='h-4 w-4'>{item.icon}</div>
      </div>
    </div>
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

function DesktopItem({ item }: { item: Item }) {
  if (!item) return <Separator className='h-10' orientation='vertical' />
  return (
    <IconContainer
      title={item.title}
      icon={item.icon}
      href={item.type === 'link' ? item.href : undefined}
      content={item.type === 'popover' ? item.content : undefined}
      onClick={item.type === 'action' ? item.onClick : undefined}
    />
  )
}

type IconProps = {
  title: string | ReactNode
  icon: ReactNode
  href?: string
  content?: ReactNode
  onClick?: () => void
}

function IconContainer({ title, icon, href, content, onClick }: IconProps) {
  const pathname = usePathname()

  const Container = (
    <div
      data-magnify-item
      onClick={onClick}
      className='group/dock relative flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200 transition-transform active:scale-95 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800'
    >
      {/* C9: tooltip bằng CSS group-hover (thay AnimatePresence) */}
      <div className='pointer-events-none absolute -top-8 left-1/2 w-fit -translate-x-1/2 translate-y-1 whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 opacity-0 transition-[opacity,transform] duration-150 group-hover/dock:translate-y-0 group-hover/dock:opacity-100 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white'>
        {title}
      </div>
      <div data-magnify-icon className='flex h-5 w-5 items-center justify-center'>
        {icon}
      </div>
      {href && pathname === href && <IndicatorDesktop />}
    </div>
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
