import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const ChevronDownIcon = forwardRef<SVGSVGElement, StaticIconProps>(function ChevronDownIcon(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='m6 9 6 6 6-6' />
    </StaticIcon>
  )
})
