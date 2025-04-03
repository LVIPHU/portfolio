'use client'
import React, { useState, useMemo, useCallback, memo } from 'react'
import { NavigationLink } from '@/components/atoms/navigation-link'
import { useIsomorphicLayoutEffect } from '@/hooks'
import Image from 'next/image'

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

const VideoCard = memo((props: VideoCardProps) => {
  const { name, href, gridColumn, gridRow, videoRef, onPointerEnter, onPointerLeave, onPointerMove } = props
  const [thumbnail, setThumbnail] = useState<string | null>(null)

  const captureThumbnail = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageUrl = canvas.toDataURL('image/png')
      setThumbnail(imageUrl)
    }
  }, [videoRef])

  useIsomorphicLayoutEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.addEventListener('loadeddata', captureThumbnail)

    return () => video.removeEventListener('loadeddata', captureThumbnail)
  }, [captureThumbnail])

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerEnter(e, href, name)
    },
    [href, name, onPointerEnter]
  )

  const handlePointerLeave = useCallback(() => {
    onPointerLeave(name)
  }, [name, onPointerLeave])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove(e)
    },
    [onPointerMove]
  )

  const videoSource = useMemo(() => `/static/videos/${name}.mp4`, [name])

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
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={`Thumbnail of ${name}`}
              width={300}
              height={300}
              loading='lazy'
              priority={false}
            />
          ) : (
            <video ref={videoRef} width={300} height={300} muted loop playsInline>
              <source src={videoSource} type='video/mp4' />
            </video>
          )}
        </div>
      </div>
    </NavigationLink>
  )
})

VideoCard.displayName = 'VideoCard'

export { VideoCard }
