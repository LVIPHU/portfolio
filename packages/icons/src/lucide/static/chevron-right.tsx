import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const ChevronRight = forwardRef<SVGSVGElement, StaticIconProps>(function ChevronRight(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='m9 18 6-6-6-6' />
    </StaticIcon>
  )
})
export { ChevronRight as ChevronRightIcon }
