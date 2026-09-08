import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const PanelBottomOpen = forwardRef<SVGSVGElement, StaticIconProps>(function PanelBottomOpen(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <rect width='18' height='18' x='3' y='3' rx='2' />
      <path d='M3 15h18' />
      <path d='m9 10 3-3 3 3' />
    </StaticIcon>
  )
})
