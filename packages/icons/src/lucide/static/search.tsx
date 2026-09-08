import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const Search = forwardRef<SVGSVGElement, StaticIconProps>(function Search(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='m21 21-4.34-4.34' />
      <circle cx='11' cy='11' r='8' />
    </StaticIcon>
  )
})
