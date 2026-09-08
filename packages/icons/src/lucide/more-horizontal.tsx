'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const MoreHorizontalIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  function MoreHorizontalIcon(props, ref) {
    return (
      <AnimatedIcon ref={ref} {...props}>
        <circle cx='12' cy='12' r='1' />
        <circle cx='19' cy='12' r='1' />
        <circle cx='5' cy='12' r='1' />
      </AnimatedIcon>
    )
  }
)
