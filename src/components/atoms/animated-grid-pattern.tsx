'use client'

import { motion } from 'motion/react'
import { useEffect, useId, useRef, useState, useMemo, useCallback, memo } from 'react'

import { cn } from '@/utils'

interface AnimatedGridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: string | number
  numSquares?: number
  className?: string
  maxOpacity?: number
  duration?: number
  repeatDelay?: number
}

const Square = memo(
  ({
    pos,
    id,
    width,
    height,
    maxOpacity,
    duration,
    index,
    onAnimationComplete,
  }: {
    pos: [number, number]
    id: number
    width: number
    height: number
    maxOpacity: number
    duration: number
    index: number
    onAnimationComplete: () => void
  }) => (
    <motion.rect
      initial={{ opacity: 0 }}
      animate={{ opacity: maxOpacity }}
      transition={{
        duration,
        repeat: 1,
        delay: index * 0.1,
        repeatType: 'reverse',
      }}
      onAnimationComplete={onAnimationComplete}
      key={`${pos[0]}-${pos[1]}-${index}`}
      width={width - 1}
      height={height - 1}
      x={pos[0] * width + 1}
      y={pos[1] * height + 1}
      fill='currentColor'
      strokeWidth='0'
    />
  )
)

Square.displayName = 'Square'

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId()
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const getPos = useCallback(() => {
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ] as [number, number]
  }, [dimensions.width, dimensions.height, width, height])

  const generateSquares = useCallback(
    (count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        pos: getPos(),
      }))
    },
    [getPos]
  )

  const [squares, setSquares] = useState(() => generateSquares(numSquares))

  const updateSquarePosition = useCallback(
    (id: number) => {
      setSquares((currentSquares) =>
        currentSquares.map((sq) =>
          sq.id === id
            ? {
                ...sq,
                pos: getPos(),
              }
            : sq
        )
      )
    },
    [getPos]
  )

  // Memoize the pattern definition
  const patternDef = useMemo(
    () => (
      <pattern id={id} width={width} height={height} patternUnits='userSpaceOnUse' x={x} y={y}>
        <path d={`M.5 ${height}V.5H${width}`} fill='none' strokeDasharray={strokeDasharray} />
      </pattern>
    ),
    [id, width, height, x, y, strokeDasharray]
  )

  // Update squares to animate in
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares))
    }
  }, [dimensions, numSquares, generateSquares])

  // Resize observer to update container dimensions
  useEffect(() => {
    const currentRef = containerRef.current
    if (!currentRef) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })

    resizeObserver.observe(currentRef)
    return () => resizeObserver.unobserve(currentRef)
  }, [containerRef])

  return (
    <svg
      ref={containerRef}
      aria-hidden='true'
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30',
        className
      )}
      {...props}
    >
      <defs>{patternDef}</defs>
      <rect width='100%' height='100%' fill={`url(#${id})`} />
      <svg x={x} y={y} className='overflow-visible'>
        {squares.map(({ pos, id }, index) => (
          <Square
            key={`${pos[0]}-${pos[1]}-${index}`}
            pos={pos}
            id={id}
            width={width}
            height={height}
            maxOpacity={maxOpacity}
            duration={duration}
            index={index}
            onAnimationComplete={() => updateSquarePosition(id)}
          />
        ))}
      </svg>
    </svg>
  )
}
