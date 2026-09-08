import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const ChevronsUp = forwardRef<SVGSVGElement, StaticIconProps>(function ChevronsUp(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='m17 11-5-5-5 5' />
      <path d='m17 18-5-5-5 5' />
    </StaticIcon>
  )
})
