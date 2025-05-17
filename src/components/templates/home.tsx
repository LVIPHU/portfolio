'use client'
import { Boxes, FadeContent, Logo, VideoCard } from '@/components/atoms'
import React, { useCallback, useRef, useState } from 'react'

const DISTANCE_MOUSE = 160
const DISTANCE_SCREEN = 50

export type VideoKey = 'video_1' | 'video_2' | 'video_3' | 'video_4' | 'video_5'
type VideoRefs = Record<VideoKey, React.RefObject<HTMLVideoElement | null>>

export const HomeTemplate: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const videoRefs = useRef<VideoRefs>({
    video_1: React.createRef<HTMLVideoElement>(),
    video_2: React.createRef<HTMLVideoElement>(),
    video_3: React.createRef<HTMLVideoElement>(),
    video_4: React.createRef<HTMLVideoElement>(),
    video_5: React.createRef<HTMLVideoElement>(),
  })

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [href, setHref] = useState('')
  const [cursorY, setCursorY] = useState(0)

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, href: string, name: VideoKey) => {
      if (e.pointerType !== 'touch') {
        setHref(href)
      }
      videoRefs.current[name]?.current?.play()
    },
    [videoRefs]
  )

  const handlePointerLeave = useCallback(
    (name: VideoKey) => {
      setHref('')
      videoRefs.current[name]?.current?.pause()
    },
    [videoRefs]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      setCursorY(e.clientY)
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    },
    [containerRef]
  )

  const distance = Math.min(DISTANCE_MOUSE, cursorY - DISTANCE_SCREEN)

  return (
    <main ref={containerRef} className='relative flex min-h-screen w-full flex-col overflow-hidden bg-background'>
      <Boxes>
        <VideoCard
          idx={1}
          href='/about'
          name='video_1'
          gridColumn='10 / 14'
          gridRow='9 / 12'
          ref={videoRefs.current.video_1}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
        />
        <VideoCard
          idx={2}
          href='/projects'
          name='video_2'
          gridColumn='16 / 20'
          gridRow='10 / 13'
          ref={videoRefs.current.video_2}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
        />
        <VideoCard
          idx={3}
          href='/blog'
          name='video_3'
          gridColumn='19 / 24'
          gridRow='16 / 19'
          ref={videoRefs.current.video_3}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
        />
        <VideoCard
          idx={4}
          href='/photos'
          name='video_4'
          gridColumn='13 / 18'
          gridRow='19 / 22'
          ref={videoRefs.current.video_4}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
        />
        <VideoCard
          idx={5}
          href='/tags'
          name='video_5'
          gridColumn='12 / 7'
          gridRow='13 / 16'
          ref={videoRefs.current.video_5}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
        />
        <div
          className='pointer-events-none absolute z-10'
          style={{
            gridColumn: '13 / 14',
            gridRow: '13 / 14',
          }}
        >
          <FadeContent key='logo' blur={true} duration={500}>
            <Logo />
          </FadeContent>
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
