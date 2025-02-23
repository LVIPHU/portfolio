'use client'
import React from 'react'
import { Boxes } from '@/components/atoms'

export const HomeTemplate = () => {
  return (
    <div className='relative min-h-screen w-screen overflow-hidden bg-background flex flex-col items-center justify-center'>
      <div className='absolute inset-0 w-full h-full bg-background z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none' />
      <Boxes />
    </div>
  )
}
