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
      className='absolute z-10 cursor-pointer select-none drop-shadow-2xl grayscale transition-all hover:grayscale-0 active:scale-95 active:drop-shadow-md'
      style={{ gridColumn, gridRow }}
    >
      <div
        className='relative'
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
      >
        <div className='bg-white'>
          <video
            ref={videoRef}
            poster={`/static/videos/poster/${name}.jpg`}
            width={300}
            height={300}
            muted
            loop
            playsInline
          >
            <source src={`/static/videos/${name}.mp4`} type='video/mp4' />
          </video>
        </div>
      </div>
    </NavigationLink>
  )
}
