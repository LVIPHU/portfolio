import React from 'react'
import { NavigationLink } from '@/components/atoms/navigation-link'
import { FadeContent } from '@/components/atoms/fade-content'

interface VideoCardProps {
  idx?: number
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
  const { idx = 0, name, href, gridColumn, gridRow, videoRef, onPointerEnter, onPointerLeave, onPointerMove } = props

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
    <NavigationLink href={href} className='absolute z-10 h-full w-full' style={{ gridColumn, gridRow }}>
      <FadeContent blur={true} delay={idx * 300} duration={500} className='h-full w-full'>
        <div
          onPointerMove={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className='relative h-full w-full cursor-pointer select-none shadow-[32px_50px_50px_0px_#193A3E55] grayscale transition-all hover:grayscale-0 active:scale-95 active:shadow-[8px_8px_12px_-4px_#00132960]'
        >
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
      </FadeContent>
    </NavigationLink>
  )
}
