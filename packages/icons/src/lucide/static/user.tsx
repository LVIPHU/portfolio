import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const User = forwardRef<SVGSVGElement, StaticIconProps>(function User(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
      <circle cx='12' cy='7' r='4' />
    </StaticIcon>
  )
})
