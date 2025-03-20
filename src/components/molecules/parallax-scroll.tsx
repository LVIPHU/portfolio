'use client'
import { useScroll, useTransform } from 'framer-motion'
import { motion } from 'framer-motion'
import { cn, imageDriveLoader } from '@/libs/utils'
import * as React from 'react'
import Image, { ImageProps } from 'next/image'

const ImageContainer = (props: ImageProps) => {
  const { className, alt, src, width = 1080, height = 1439, ...rest } = props
  return (
    <div className='relative block overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800'>
      <Image
        sizes='(min-width: 1540px) 483px, (min-width: 1280px) 398px, (min-width: 1040px) 312px, (min-width: 780px) 350px, (min-width: 680px) 592px, calc(94.44vw - 31px)'
        decoding='async'
        priority
        {...rest}
        width={width}
        height={height}
        alt={alt || 'none'}
        className={cn(className, 'object-cover')}
        src={imageDriveLoader({ id: src as string })}
      />
    </div>
  )
}

type ParallaxScrollImage = { id: string; src: string }

interface ParallaxScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  images: ParallaxScrollImage[]
}

const ParallaxScroll = React.forwardRef<HTMLDivElement, ParallaxScrollProps>((props, ref) => {
  const { images, className } = props
  const { scrollYProgress } = useScroll({})

  const translateFirst = useTransform(scrollYProgress, [0, 20], [0, -200])
  const translateSecond = useTransform(scrollYProgress, [0, 20], [0, 200])
  const translateThird = useTransform(scrollYProgress, [0, 20], [0, -200])

  const third = Math.ceil(images.length / 3)

  const firstPart = images.slice(0, third)
  const secondPart = images.slice(third, 2 * third)
  const thirdPart = images.slice(2 * third)

  return (
    <div ref={ref} className={cn('grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
      <ul className='grid gap-6'>
        {firstPart.map(({ src, id }) => (
          <motion.li style={{ y: translateFirst }} key={'grid-1' + id}>
            <ImageContainer src={src} alt={'thumbnail-' + id} />
          </motion.li>
        ))}
      </ul>
      <ul className='grid gap-6'>
        {secondPart.map(({ src, id }) => (
          <motion.li style={{ y: translateSecond }} key={'grid-2' + id}>
            <ImageContainer src={src} alt={'thumbnail-' + id} />
          </motion.li>
        ))}
      </ul>
      <ul className='grid gap-6'>
        {thirdPart.map(({ src, id }) => (
          <motion.li style={{ y: translateThird }} key={'grid-3' + id}>
            <ImageContainer src={src} alt={'thumbnail-' + id} />
          </motion.li>
        ))}
      </ul>
    </div>
  )
})

ParallaxScroll.displayName = 'ParallaxScroll'

export { ParallaxScroll, ImageContainer }
export type { ParallaxScrollImage }
