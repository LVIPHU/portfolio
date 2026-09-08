'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const Book = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function Book(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20' />
    </AnimatedIcon>
  )
})
