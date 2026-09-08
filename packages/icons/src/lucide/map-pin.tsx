'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const MapPinIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function MapPinIcon(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0' />
      <circle cx='12' cy='10' r='3' />
    </AnimatedIcon>
  )
})
