import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const XIcon = forwardRef<SVGSVGElement, StaticIconProps>(function XIcon(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='M18 6 6 18' />
      <path d='m6 6 12 12' />
    </StaticIcon>
  )
})
