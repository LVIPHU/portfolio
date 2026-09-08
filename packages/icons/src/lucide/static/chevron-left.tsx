import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const ChevronLeft = forwardRef<SVGSVGElement, StaticIconProps>(function ChevronLeft(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='m15 18-6-6 6-6' />
    </StaticIcon>
  )
})
export { ChevronLeft as ChevronLeftIcon }
