'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const Info = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function Info(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <circle cx='12' cy='12' r='10' />
      <path d='M12 16v-4' />
      <path d='M12 8h.01' />
    </AnimatedIcon>
  )
})
