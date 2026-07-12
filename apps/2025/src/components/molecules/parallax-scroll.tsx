'use client'
import { cn, imageDriveLoader } from '@/utils'
import * as React from 'react'
import { ImageProps } from 'next/image'
import { Image, Zoom } from '@/components/atoms'
import { ParallaxColumns } from '@portfolio/ui/motion'

const ImageContainer = (props: ImageProps) => {
  const { alt, src, width = 1080, height = 1439, ...rest } = props
  return (
    <Zoom>
      <Image
        sizes='(min-width: 1540px) 483px, (min-width: 1280px) 398px, (min-width: 1040px) 312px, (min-width: 780px) 350px, (min-width: 680px) 592px, calc(94.44vw - 31px)'
        width={width}
        height={height}
        alt={alt || 'none'}
        src={imageDriveLoader({ id: src as string })}
        {...rest}
      />
    </Zoom>
  )
}

type ParallaxScrollImage = { id: string; src: string }

interface ParallaxScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  images: ParallaxScrollImage[]
}

// C9 (M-02 #5): 3 cột parallax bằng ParallaxColumns (ScrollTrigger scrub), thay
// useScroll + useTransform của framer. Giữ nguyên markup ảnh 3 cột + Zoom.
const ParallaxScroll = ({ images, className }: ParallaxScrollProps) => {
  const third = Math.ceil(images.length / 3)
  const firstPart = images.slice(0, third)
  const secondPart = images.slice(third, 2 * third)
  const thirdPart = images.slice(2 * third)

  return (
    <ParallaxColumns className={cn('grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
      <ul data-parallax-col className='grid gap-6'>
        {firstPart.map(({ src, id }) => (
          <li key={'grid-1' + id}>
            <ImageContainer src={src} alt={'thumbnail-' + id} />
          </li>
        ))}
      </ul>
      <ul data-parallax-col className='grid gap-6'>
        {secondPart.map(({ src, id }) => (
          <li key={'grid-2' + id}>
            <ImageContainer src={src} alt={'thumbnail-' + id} />
          </li>
        ))}
      </ul>
      <ul data-parallax-col className='grid gap-6'>
        {thirdPart.map(({ src, id }) => (
          <li key={'grid-3' + id}>
            <ImageContainer src={src} alt={'thumbnail-' + id} />
          </li>
        ))}
      </ul>
    </ParallaxColumns>
  )
}

export { ParallaxScroll, ImageContainer }
export type { ParallaxScrollImage }
