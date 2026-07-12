'use client'
// C9 (M-02 #7, D-05): Radix→PreviewCard đã làm ở C8; nay bỏ lib animation cũ —
// follow chuột bằng gsap.quickTo (tween tái dùng trong 1 phiên hover, không alloc
// mỗi event), enter/exit để Base UI + CSS transition (data-starting/ending-style)
// quản (mượt hơn tự dựng state closing). PreviewCard = biến thể "link preview".
import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card'
import Image from 'next/image'
import { encode } from 'qss'
import React from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/utils'
import { NavigationLink } from '@/components/atoms/navigation-link'

gsap.registerPlugin(useGSAP)

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

  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const followRef = React.useRef<HTMLDivElement>(null)
  const xTo = React.useRef<((value: number) => void) | null>(null)

  const { contextSafe } = useGSAP()

  // D-05: quickTo tạo 1 lần mỗi phiên hover (reset khi đóng), handler chỉ gọi.
  const handleMouseMove = contextSafe((event: React.MouseEvent) => {
    if (!followRef.current) return
    if (!xTo.current) {
      xTo.current = gsap.quickTo(followRef.current, 'x', { duration: 0.3, ease: 'power3' })
    }
    const target = event.currentTarget as HTMLElement
    const targetRect = target.getBoundingClientRect()
    const eventOffsetX = event.clientX - targetRect.left
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2
    xTo.current(offsetFromCenter)
  })

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
          if (!open) xTo.current = null
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
            <PreviewCardPrimitive.Popup className='origin-(--transform-origin) transition-[transform,opacity] duration-200 ease-out data-[ending-style]:scale-90 data-[starting-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0'>
              <div ref={followRef} className='rounded-xl shadow-xl'>
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
              </div>
            </PreviewCardPrimitive.Popup>
          </PreviewCardPrimitive.Positioner>
        </PreviewCardPrimitive.Portal>
      </PreviewCardPrimitive.Root>
    </>
  )
}
