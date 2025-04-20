'use client'
import { Boxes, SocialIcons, VideoCard } from '@/components/atoms'
import React, { useRef, useState } from 'react'
import { useTheme } from 'next-themes'

const DISTANCE_MOUSE = 160
const DISTANCE_SCREEN = 50

export const HomeTemplate: React.FC = () => {
  const { systemTheme, theme } = useTheme()

  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRefs: Record<string, React.RefObject<HTMLVideoElement | null>> = {
    video_1: useRef<HTMLVideoElement | null>(null),
    video_2: useRef<HTMLVideoElement | null>(null),
    video_3: useRef<HTMLVideoElement | null>(null),
    video_4: useRef<HTMLVideoElement | null>(null),
  }

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [href, setHref] = useState('')
  const [cursorY, setCursorY] = useState(0)

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>, href: string, name: string) => {
    if (e.pointerType !== 'touch') {
      setHref(href)
    }
    videoRefs[name].current?.play()
  }

  const handlePointerLeave = (name: string) => {
    setHref('')
    videoRefs[name].current?.pause()
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
          href='/about'
          name='video_1'
          gridColumn='12 / 16'
          gridRow='10 / span 2'
          videoRef={videoRefs.video_1}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
        />
        <VideoCard
          href='/projects'
          name='video_2'
          gridColumn='20 / span 4'
          gridRow='14 / span 3'
          videoRef={videoRefs.video_2}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
        />
        <VideoCard
          href='/blog'
          name='video_3'
          gridColumn='14 / 17'
          gridRow='19 / span 3'
          videoRef={videoRefs.video_3}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
        />
        <VideoCard
          href='/photos'
          name='video_4'
          gridColumn='14 / 9'
          gridRow='14 / span 3'
          videoRef={videoRefs.video_4}
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
          <SocialIcons kind={`logo${theme === 'system' ? systemTheme : theme}`} iconType='icon' size={96} />
        </div>
      </Boxes>
      {href && (
        <div
          className='pointer-events-none absolute z-30 mix-blend-difference'
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(0, -110%)',
          }}
        >
          <p className='whitespace-nowrap text-white'>{href.replaceAll('/', '/ ')}</p>
          <div
            className='bg-white transition-all duration-300'
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
