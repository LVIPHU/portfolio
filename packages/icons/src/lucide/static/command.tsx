import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const Command = forwardRef<SVGSVGElement, StaticIconProps>(function Command(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
    </StaticIcon>
  )
})
