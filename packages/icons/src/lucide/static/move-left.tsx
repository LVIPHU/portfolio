import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const MoveLeft = forwardRef<SVGSVGElement, StaticIconProps>(function MoveLeft(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='M6 8L2 12L6 16' />
      <path d='M2 12H22' />
    </StaticIcon>
  )
})
