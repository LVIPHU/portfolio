import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const GalleryHorizontal = forwardRef<SVGSVGElement, StaticIconProps>(function GalleryHorizontal(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='M2 3v18' />
      <rect width='12' height='18' x='6' y='3' rx='2' />
      <path d='M22 3v18' />
    </StaticIcon>
  )
})
