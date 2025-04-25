import React from 'react'
import { NavigationLink } from '@/components/atoms/navigation-link'

interface VideoCardProps {
  name: string
  href: string
  gridColumn: string
  gridRow: string
  videoRef: React.RefObject<HTMLVideoElement | null>
  onPointerEnter: (e: React.PointerEvent<HTMLDivElement>, href: string, name: string) => void
  onPointerLeave: (name: string) => void
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void
}

export const VideoCard = (props: VideoCardProps) => {
  const { name, href, gridColumn, gridRow, videoRef, onPointerEnter, onPointerLeave, onPointerMove } = props

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerEnter(e, href, name)
  }

  const handlePointerLeave = () => {
    onPointerLeave(name)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove(e)
  }

  return (
    <NavigationLink
      href={href}
      className='absolute z-10 h-full w-full cursor-pointer select-none shadow-[32px_50px_50px_0px_#193A3E55] grayscale transition-all hover:grayscale-0 active:scale-95 active:shadow-[8px_8px_12px_-4px_#00132960]'
      style={{ gridColumn, gridRow }}
    >
      <div
        className='relative h-full w-full'
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
      >
        <div className='h-full w-full bg-white'>
          <video
            ref={videoRef}
            poster={`/static/videos/poster/${name}.jpg`}
            muted
            loop
            playsInline
            className='aspect-video h-full w-full object-cover'
          >
            <source src={`/static/videos/${name}.mp4`} type='video/mp4' />
          </video>
        </div>
      </div>
    </NavigationLink>
  )
}
