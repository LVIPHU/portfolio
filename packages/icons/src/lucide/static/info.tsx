import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const Info = forwardRef<SVGSVGElement, StaticIconProps>(function Info(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <circle cx='12' cy='12' r='10' />
      <path d='M12 16v-4' />
      <path d='M12 8h.01' />
    </StaticIcon>
  )
})
