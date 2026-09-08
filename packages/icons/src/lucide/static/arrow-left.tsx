import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const ArrowLeft = forwardRef<SVGSVGElement, StaticIconProps>(function ArrowLeft(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='m12 19-7-7 7-7' />
      <path d='M19 12H5' />
    </StaticIcon>
  )
})
