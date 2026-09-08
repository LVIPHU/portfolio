import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const MoreHorizontalIcon = forwardRef<SVGSVGElement, StaticIconProps>(function MoreHorizontalIcon(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <circle cx='12' cy='12' r='1' />
      <circle cx='19' cy='12' r='1' />
      <circle cx='5' cy='12' r='1' />
    </StaticIcon>
  )
})
