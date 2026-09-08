import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const List = forwardRef<SVGSVGElement, StaticIconProps>(function List(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='M3 5h.01' />
      <path d='M3 12h.01' />
      <path d='M3 19h.01' />
      <path d='M8 5h13' />
      <path d='M8 12h13' />
      <path d='M8 19h13' />
    </StaticIcon>
  )
})
