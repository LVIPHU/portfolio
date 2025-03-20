'use client'
import React, { useRef, useState } from 'react'

const DISTANCE_MOUSE = 160
const DISTANCE_SCREEN = 50

type HoverVideoPinProps = {
  name: string
  width?: string | number
  height?: string | number
}

export const HoverVideoPin = (props: HoverVideoPinProps) => {
  const { name, width = 350, height = 350 } = props
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [cursorY, setCursorY] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const isTouch = useRef(false)

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') isTouch.current = true
    setIsHovered(true)
    videoRef.current?.play()
  }

  const handlePointerLeave = () => {
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
    <div
      ref={containerRef}
      className='relative'
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <div className='bg-white'>
        <video
          ref={videoRef}
          width={width}
          height={height}
          muted
          style={{
            filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
            transition: 'filter 0.3s ease-in-out',
          }}
        >
          <source src={`/static/videos/${name}.mp4`} type='video/mp4' />
        </video>
      </div>

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
    </div>
  )
}
