'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const List = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function List(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='M3 5h.01' />
      <path d='M3 12h.01' />
      <path d='M3 19h.01' />
      <path d='M8 5h13' />
      <path d='M8 12h13' />
      <path d='M8 19h13' />
    </AnimatedIcon>
  )
})
