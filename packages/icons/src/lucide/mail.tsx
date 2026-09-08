'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const Mail = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function Mail(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7' />
      <rect x='2' y='4' width='20' height='16' rx='2' />
    </AnimatedIcon>
  )
})
export { Mail as MailIcon }
