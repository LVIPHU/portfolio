'use client'
// C8 (D-10): Radix hover-card → PreviewCard của Base UI (giữ framer-motion,
// port motion sang GSAP ở C9). PreviewCard = biến thể "link preview" của HoverCard.
import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card'
import Image from 'next/image'
import { encode } from 'qss'
import React from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/utils'
import { NavigationLink } from '@/components/atoms/navigation-link'

type LinkPreviewProps = {
  children: React.ReactNode
  url: string
  className?: string
  width?: number
  height?: number
  quality?: number
  layout?: string
} & ({ isStatic: true; imageSrc: string } | { isStatic?: false; imageSrc?: never })

export const LinkPreview = ({
  children,
  url,
  className,
  width = 200,
  height = 125,
  quality = 50,
  layout = 'fixed',
  isStatic = false,
  imageSrc = '',
}: LinkPreviewProps) => {
  let src
  if (!isStatic) {
    const params = encode({
      url,
      screenshot: true,
      meta: false,
      embed: 'screenshot.url',
      colorScheme: 'dark',
      'viewport.isMobile': true,
      'viewport.deviceScaleFactor': 1,
      'viewport.width': width * 3,
      'viewport.height': height * 3,
    })
    src = `https://api.microlink.io/?${params}`
  } else {
    src = imageSrc
  }

  const [isOpen, setOpen] = React.useState(false)

  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const springConfig = { stiffness: 100, damping: 15 }
  const x = useMotionValue(0)

  const translateX = useSpring(x, springConfig)

  const handleMouseMove = (event: any) => {
    const targetRect = event.target.getBoundingClientRect()
    const eventOffsetX = event.clientX - targetRect.left
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2 // Reduce the effect to make it subtle
    x.set(offsetFromCenter)
  }

  return (
    <>
      {isMounted ? (
        <div className='hidden'>
          <Image
            src={src}
            width={width}
            height={height}
            quality={quality}
            layout={layout}
            priority={true}
            alt='hidden image'
          />
        </div>
      ) : null}

      <PreviewCardPrimitive.Root
        onOpenChange={(open: boolean) => {
          setOpen(open)
        }}
      >
        <PreviewCardPrimitive.Trigger
          onMouseMove={handleMouseMove}
          className={cn('text-black dark:text-white', className)}
          href={url}
        >
          {children}
        </PreviewCardPrimitive.Trigger>

        <PreviewCardPrimitive.Portal>
          <PreviewCardPrimitive.Positioner side='top' align='center' sideOffset={10} className='isolate z-50'>
            <PreviewCardPrimitive.Popup className='[transform-origin:var(--transform-origin)]'>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                      },
                    }}
                    exit={{ opacity: 0, y: 20, scale: 0.6 }}
                    className='rounded-xl shadow-xl'
                    style={{
                      x: translateX,
                    }}
                  >
                    <NavigationLink
                      href={url}
                      style={{ fontSize: 0 }}
                      className='block rounded-xl border-2 border-transparent bg-white p-1 shadow hover:border-neutral-200 dark:hover:border-neutral-800'
                    >
                      <Image
                        src={isStatic ? imageSrc : src}
                        width={width}
                        height={height}
                        quality={quality}
                        layout={layout}
                        priority={true}
                        className='rounded-lg'
                        alt='preview image'
                      />
                    </NavigationLink>
                  </motion.div>
                )}
              </AnimatePresence>
            </PreviewCardPrimitive.Popup>
          </PreviewCardPrimitive.Positioner>
        </PreviewCardPrimitive.Portal>
      </PreviewCardPrimitive.Root>
    </>
  )
}
