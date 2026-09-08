import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

export const Check = forwardRef<SVGSVGElement, StaticIconProps>(function Check(props, ref) {
  return (
    <StaticIcon ref={ref} {...props}>
      <path d='M20 6 9 17l-5-5' />
    </StaticIcon>
  )
})
export { Check as CheckIcon }
