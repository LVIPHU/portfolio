import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const ArrowRight = forwardRef<SVGSVGElement, StaticIconProps>(function ArrowRight(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='M5 12h14' />
      <path d='m12 5 7 7-7 7' />
    </StaticIcon>
  )
})
