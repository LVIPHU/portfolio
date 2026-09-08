'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const Check = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function Check(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='M20 6 9 17l-5-5' />
    </AnimatedIcon>
  )
})
export { Check as CheckIcon }
