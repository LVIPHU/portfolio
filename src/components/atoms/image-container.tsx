import Image, { ImageProps } from 'next/image'
import { cn, imageDriveLoader } from '@/libs/utils'

export const ImageContainer = (props: ImageProps) => {
  const { fill, className, alt, src, ...rest } = props
  return (
    <div className={'bg-card-foreground h-80 w-full relative overflow-hidden rounded-lg'}>
      <Image
        {...rest}
        fill={fill || true}
        src={imageDriveLoader({ id: src as string })}
        alt={alt || 'none'}
        className={cn(className, 'object-cover')}
      />
    </div>
  )
}
