import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const Eye = forwardRef<SVGSVGElement, StaticIconProps>(function Eye(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' />
      <circle cx='12' cy='12' r='3' />
    </StaticIcon>
  )
})
