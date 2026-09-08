import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const Dot = forwardRef<SVGSVGElement, StaticIconProps>(function Dot(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <circle cx='12' cy='12' r='1' />
    </StaticIcon>
  )
})
