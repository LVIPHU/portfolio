'use client'
import { Boxes, SocialIcons, VideoCard } from '@/components/atoms'
import React, { useRef, useState } from 'react'

const DISTANCE_MOUSE = 160
const DISTANCE_SCREEN = 50

export const HomeTemplate: React.FC = () => {
  const videoRef1 = useRef<HTMLVideoElement | null>(null)
  const videoRef2 = useRef<HTMLVideoElement | null>(null)
  const videoRef3 = useRef<HTMLVideoElement | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [cursorY, setCursorY] = useState(0)
  const isTouch = useRef(false)

  const handlePointerEnter = (
    e: React.PointerEvent<HTMLDivElement>,
    videoRef: React.RefObject<HTMLVideoElement | null>
  ) => {
    if (e.pointerType === 'touch') {
      isTouch.current = true
    }
    setIsHovered(true)
    videoRef.current?.play()
  }

  const handlePointerLeave = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
    setIsHovered(false)
    videoRef.current?.pause()
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    setCursorY(e.clientY)
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const distance = Math.min(DISTANCE_MOUSE, cursorY - DISTANCE_SCREEN)

  return (
    <main ref={containerRef} className='relative flex min-h-screen w-full flex-col overflow-hidden bg-background'>
      <Boxes>
        <VideoCard
          gridColumn='12 / 16'
          gridRow='10 / span 2'
          videoSrc='/static/videos/1.mp4'
          videoRef={videoRef1}
          isHovered={isHovered}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
        />
        <VideoCard
          gridColumn='20 / span 4'
          gridRow='14 / span 3'
          videoSrc='/static/videos/2.mp4'
          videoRef={videoRef2}
          isHovered={isHovered}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
        />
        <VideoCard
          gridColumn='14 / 17'
          gridRow='19 / span 3'
          videoSrc='/static/videos/3.mp4'
          videoRef={videoRef3}
          isHovered={isHovered}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
        />
        <div
          className='pointer-events-none absolute z-10'
          style={{
            gridColumn: '14 / 15',
            gridRow: '13 / span 1',
          }}
        >
          <SocialIcons kind='logolight' iconType='icon' size={96} />
        </div>
      </Boxes>
      {isHovered && !isTouch.current && (
        <div
          className='pointer-events-none absolute z-30 cursor-pointer'
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(0, -110%)',
          }}
        >
          <p className='whitespace-nowrap text-black'>Vị trí Label</p>
          <div
            className='bg-black transition-all duration-300'
            style={{
              height: distance,
              width: '1px',
              transformOrigin: 'bottom center',
            }}
          />
        </div>
      )}
    </main>
  )
}
