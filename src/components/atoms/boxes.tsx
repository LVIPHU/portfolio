'use client'
import React, { CSSProperties, memo, useRef, useState } from 'react'
import { cn } from '@/libs/utils'
import { useIsomorphicLayoutEffect } from '@/hooks'

const totalGrid = 900

const colors = ['lime', 'amber', 'sky']

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)]
}

type BoxCellProps = {
  id: string
}

const Cell = memo(function BoxCell({ id }: BoxCellProps) {
  const [color, setColor] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  useIsomorphicLayoutEffect(() => {
    setColor(getRandomColor())
  }, [isHovered])

  const styles: CSSProperties & { '--transition': string } = {
    '--transition': isHovered ? `background 0s ease` : `background 2s ease`,
    backgroundColor: isHovered ? `var(--${color}-500)` : 'transparent',
    transition: 'opacity 250ms ease-out, var(--transition)',
  }

  return (
    <div
      className={cn({
        'box-cell-0': id === '0',
        'box-cell-2': id === '2',
        'box-cell-3': id === '3',
      })}
      style={styles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    ></div>
  )
})

const Grid = memo(function BoxRow() {
  const cells = Array.from({ length: 4 }, (_, i) => i)
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const element = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
      }
    )

    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return (
    <div ref={ref} className='box-grid'>
      {isVisible ? (
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
      ) : null}
    </div>
  )
})

type BoxCoreProps = {
  children?: React.ReactNode
}

export const BoxesCore = ({ children }: BoxCoreProps) => {
  const grids = Array.from({ length: totalGrid }, (_, i) => i)
  const [scaleValue, setScaleValue] = useState(0.6)

  useIsomorphicLayoutEffect(() => {
    function updateScale() {
      const width = window.innerWidth
      let scale: number
      if (width <= 510) {
        scale = 0.2
      } else if (width >= 1530) {
        scale = 0.6
      } else {
        // Nội suy tuyến tính từ 0.2 đến 0.6 khi viewport tăng từ 510px tới 1530px
        scale = 0.2 + ((width - 510) * 0.4) / 1020
      }
      setScaleValue(scale)
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  const styles: CSSProperties & { '--rotate': string; '--x': string; '--y': string } = {
    opacity: 1,
    '--rotate': '0deg',
    '--x': '0px',
    '--y': '0px',
    transform:
      `translate(calc(-50% + var(--x)), calc(-50% + var(--y))) ` +
      `skewX(-48deg) skewY(14deg) scaleX(2) scale(${scaleValue}) ` +
      `rotate(var(--rotate)) translateZ(0)`,
  }

  return (
    <div className={'box-container'}>
      <div style={styles} className={'box-content'}>
        {children}
        {grids.map((idx) => (
          <Grid key={idx} />
        ))}
      </div>
      <div className='pointer-events-none absolute inset-0 select-none bg-background [mask-image:radial-gradient(transparent,black)]' />
    </div>
  )
}

export const Boxes = memo(BoxesCore)
