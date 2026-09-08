import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const ChevronUpIcon = forwardRef<SVGSVGElement, StaticIconProps>(function ChevronUpIcon(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='m18 15-6-6-6 6' />
    </StaticIcon>
  )
})
