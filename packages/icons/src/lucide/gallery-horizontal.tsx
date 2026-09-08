'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const GalleryHorizontal = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  function GalleryHorizontal(props, ref) {
    return (
      <AnimatedIcon ref={ref} {...props}>
        <path d='M2 3v18' />
        <rect width='12' height='18' x='6' y='3' rx='2' />
        <path d='M22 3v18' />
      </AnimatedIcon>
    )
  }
)
