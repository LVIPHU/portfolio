import Image, { ImageProps } from 'next/image'
import { cn, imageDriveLoader } from '@/libs/utils'

export const ImageContainer = (props: ImageProps) => {
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
