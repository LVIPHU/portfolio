'use client'
import { useScroll, useTransform } from 'framer-motion'
import { motion } from 'framer-motion'
import { cn, imageDriveLoader } from '@/libs/utils'
import * as React from 'react'
import Image, { ImageProps } from 'next/image'

const ImageContainer = (props: ImageProps) => {
  const { fill, className, alt, src, ...rest } = props
  return (
    <div className={'bg-neutral-200 dark:bg-neutral-800 h-80 w-full relative overflow-hidden rounded-lg'}>
      <Image
        {...rest}
        fill={fill || true}
        src={imageDriveLoader({ id: src as string })}
        alt={alt || 'none'}
        sizes='(min-width: 1280px) 301px, (min-width: 1040px) 312px, (min-width: 780px) 350px, (min-width: 680px) 592px, calc(94.44vw - 31px)'
        className={cn(className, 'object-cover')}
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
  const translateFourth = useTransform(scrollYProgress, [0, 20], [0, 200])
  const translateFifth = useTransform(scrollYProgress, [0, 20], [0, -200])

  const fifth = Math.ceil(images.length / 5)

  const firstPart = images.slice(0, fifth)
  const secondPart = images.slice(fifth, 2 * fifth)
  const thirdPart = images.slice(2 * fifth, 3 * fifth)
  const fourthPart = images.slice(3 * fifth, 4 * fifth)
  const fifthPart = images.slice(4 * fifth)

  return (
    <div
      ref={ref}
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 items-start gap-5',
        className
      )}
    >
      <ul className='grid gap-5'>
        {firstPart.map(({ src, id }) => (
          <motion.li
            style={{ y: translateFirst }} // Apply the translateY motion value here
            key={'grid-1' + id}
          >
            <ImageContainer src={src} className='gap-5 !m-0 !p-0' alt={'thumbnail-' + id} />
          </motion.li>
        ))}
      </ul>
      <ul className='grid gap-5'>
        {secondPart.map(({ src, id }) => (
          <motion.li style={{ y: translateSecond }} key={'grid-2' + id}>
            <ImageContainer src={src} className='gap-5 !m-0 !p-0' alt={'thumbnail-' + id} />
          </motion.li>
        ))}
      </ul>
      <ul className='grid gap-5'>
        {thirdPart.map(({ src, id }) => (
          <motion.li style={{ y: translateThird }} key={'grid-3' + id}>
            <ImageContainer src={src} className='gap-5 !m-0 !p-0' alt={'thumbnail-' + id} />
          </motion.li>
        ))}
      </ul>
      <ul className='grid gap-5'>
        {fourthPart.map(({ src, id }) => (
          <motion.li style={{ y: translateFourth }} key={'grid-4' + id}>
            <ImageContainer src={src} className='gap-5 !m-0 !p-0' alt={'thumbnail-' + id} />
          </motion.li>
        ))}
      </ul>
      <ul className='grid gap-5'>
        {fifthPart.map(({ src, id }) => (
          <motion.li style={{ y: translateFifth }} key={'grid-5' + id}>
            <ImageContainer src={src} className='gap-5 !m-0 !p-0' alt={'thumbnail-' + id} />
          </motion.li>
        ))}
      </ul>
    </div>
  )
})

ParallaxScroll.displayName = 'ParallaxScroll'

export { ParallaxScroll, ImageContainer }
export type { ParallaxScrollImage }
