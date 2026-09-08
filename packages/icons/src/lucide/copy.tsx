'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const Copy = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function Copy(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <rect width='14' height='14' x='8' y='8' rx='2' ry='2' />
      <path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
    </AnimatedIcon>
  )
})
