import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const LayoutGrid = forwardRef<SVGSVGElement, StaticIconProps>(function LayoutGrid(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <rect width='7' height='7' x='3' y='3' rx='1' />
      <rect width='7' height='7' x='14' y='3' rx='1' />
      <rect width='7' height='7' x='14' y='14' rx='1' />
      <rect width='7' height='7' x='3' y='14' rx='1' />
    </StaticIcon>
  )
})
