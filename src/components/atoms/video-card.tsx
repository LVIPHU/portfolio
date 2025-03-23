import React from 'react'

interface VideoCardProps {
  gridColumn: string
  gridRow: string
  videoSrc: string
  videoRef: React.RefObject<HTMLVideoElement | null>
  isHovered: boolean
  onPointerEnter: (e: React.PointerEvent<HTMLDivElement>, videoRef: React.RefObject<HTMLVideoElement | null>) => void
  onPointerLeave: (videoRef: React.RefObject<HTMLVideoElement | null>) => void
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void
}

export const VideoCard: React.FC<VideoCardProps> = ({
  gridColumn,
  gridRow,
  videoSrc,
  videoRef,
  isHovered,
  onPointerEnter,
  onPointerLeave,
  onPointerMove,
}) => (
  <div className='absolute z-20 cursor-pointer' style={{ gridColumn, gridRow }}>
    <div
      className='relative'
      onPointerEnter={(e) => onPointerEnter(e, videoRef)}
      onPointerLeave={() => onPointerLeave(videoRef)}
      onPointerMove={onPointerMove}
    >
      <div className='bg-white'>
        <video
          ref={videoRef}
          width={300}
          height={300}
          muted
          style={{
            filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
            transition: 'filter 0.3s ease-in-out',
          }}
        >
          <source src={videoSrc} type='video/mp4' />
        </video>
      </div>
    </div>
  </div>
)
