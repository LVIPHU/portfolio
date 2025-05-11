'use client'
import React, { CSSProperties, memo, useRef, useState, useMemo } from 'react'
import { cn, initAudio, playRandomNote } from '@/utils'
import { useDragRotate, useIsomorphicLayoutEffect } from '@/hooks'
import { BREAKPOINTS, COLORS, TOTAL_GRID } from '@/constants/boxes'

type Color = (typeof COLORS)[number]

const getRandomColor = (): Color => {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

type BoxCellProps = {
  id: string
}

const Cell = memo(function BoxCell({ id }: BoxCellProps) {
  const [color, setColor] = useState<Color>('lime')
  const [isHovered, setIsHovered] = useState(false)

  useIsomorphicLayoutEffect(() => {
    setColor(getRandomColor())
  }, [isHovered])

  const styles = useMemo<CSSProperties & { '--transition': string }>(
    () => ({
      '--transition': isHovered ? `background 0s ease` : `background 2s ease`,
      backgroundColor: isHovered ? `var(--${color}-300)` : 'transparent',
      transition: 'opacity 250ms ease-out, var(--transition)',
    }),
    [isHovered, color]
  )

  return (
    <div
      className={cn({
        'box-cell-0': id === '0',
        'box-cell-2': id === '2',
        'box-cell-3': id === '3',
      })}
      style={styles}
      onClick={() => playRandomNote()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  )
})

const Grid = memo(function BoxRow() {
  const cells = useMemo(() => Array.from({ length: 4 }, (_, i) => i), [])
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 })

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [])

  return (
    <div ref={ref} className='box-grid'>
      {isVisible && (
        <>
          {cells.map((idx) => (
            <Cell id={`${idx}`} key={idx} />
          ))}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='0.4'
            stroke='currentColor'
            className='pointer-events-none absolute left-[30%] top-[30%] h-8 w-8 text-slate-600'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16M0 12h24' />
          </svg>
        </>
      )}
    </div>
  )
})

type BoxCoreProps = {
  children?: React.ReactNode
}

export const Boxes = ({ children }: BoxCoreProps) => {
  const { ref, angle, isDragging, onMouseDown } = useDragRotate()
  const grids = useMemo(() => Array.from({ length: TOTAL_GRID }, (_, i) => i), [])
  const [scaleValue, setScaleValue] = useState(0.6)

  useIsomorphicLayoutEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth
      let scale: number

      if (width <= BREAKPOINTS.mobile) {
        scale = BREAKPOINTS.minScale
      } else if (width >= BREAKPOINTS.desktop) {
        scale = BREAKPOINTS.maxScale
      } else {
        scale =
          BREAKPOINTS.minScale +
          ((width - BREAKPOINTS.mobile) * (BREAKPOINTS.maxScale - BREAKPOINTS.minScale)) /
            (BREAKPOINTS.desktop - BREAKPOINTS.mobile)
      }

      setScaleValue(scale)
    }

    initAudio()
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  const styles = useMemo<CSSProperties & { '--x': string; '--y': string }>(
    () => ({
      opacity: 1,
      '--x': '0px',
      '--y': '0px',
      transition: isDragging ? 'none' : 'transform 0.2s ease-out',
      cursor: isDragging ? 'grabbing' : 'grab',
      transform: `translate(calc(-50% + var(--x)), calc(-50% + var(--y))) skewX(-48deg) skewY(14deg) scaleX(2) scale(${scaleValue}) rotate(${angle}deg) translateZ(0)`,
    }),
    [angle, isDragging, scaleValue]
  )

  return (
    <div className='box-container'>
      <div ref={ref} style={styles} className='box-content' onMouseDown={onMouseDown}>
        {children}
        {grids.map((idx) => (
          <Grid key={idx} />
        ))}
      </div>
      <div className='[WebkitMaskImage:radial-gradient(ellipse_at_center,transparent_50%,black)] pointer-events-none fixed inset-0 select-none backdrop-blur-sm [background:radial-gradient(ellipse_at_center,transparent_50%,var(-----background))] [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]' />
    </div>
  )
}
