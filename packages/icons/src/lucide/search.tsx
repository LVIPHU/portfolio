'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const Search = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function Search(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='m21 21-4.34-4.34' />
      <circle cx='11' cy='11' r='8' />
    </AnimatedIcon>
  )
})
