import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const Clock = forwardRef<SVGSVGElement, StaticIconProps>(function Clock(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <circle cx='12' cy='12' r='10' />
      <path d='M12 6v6l4 2' />
    </StaticIcon>
  )
})
