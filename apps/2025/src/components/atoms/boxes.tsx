'use client'
import React, { CSSProperties, memo, useState, useMemo, useEffect, useLayoutEffect } from 'react'
import { cn } from '@portfolio/utils'
import { initAudio, playRandomNote } from '@/utils'
import { useDragRotate } from '@portfolio/hooks'
import { BREAKPOINTS, COLORS, TOTAL_GRID } from '@/constants/boxes'

type Color = (typeof COLORS)[number]

const getRandomColor = (): Color => {
  return COLORS[Math.floor(Math.random() * COLORS.length)] ?? 'lime'
}

const COLOR_MAP: Record<Color, string> = {
  lime: 'rgb(190 242 100)',
  amber: 'rgb(252 211 77)',
  sky: 'rgb(125 211 252)',
}

type BoxCellProps = {
  id: string
}

const Cell = memo(function BoxCell({ id }: BoxCellProps) {
  const [color, setColor] = useState<Color>('lime')
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setColor(getRandomColor())
  }, [isHovered])

  const styles = useMemo<CSSProperties & { '--transition': string }>(
    () => ({
      '--transition': isHovered ? `background 0s ease` : `background 2s ease`,
      backgroundColor: isHovered ? COLOR_MAP[color] : 'transparent',
      transition: 'opacity 250ms ease-out, var(--transition)',
    }),
    [isHovered, color]
  )

  return (
    <button
      type='button'
      // Trang trí thuần (tổ tiên đã aria-hidden): tabIndex -1 giữ nút ngoài tab order —
      // 3.600 nút focusable từng bắt người dùng bàn phím Tab xuyên qua cả lưới,
      // và aria-hidden đè lên phần tử focusable là vi phạm WCAG nếu thiếu dòng này.
      tabIndex={-1}
      className={cn('h-full w-full appearance-none p-0', {
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

  return (
    <div className='box-grid'>
      {cells.map((cellIdx) => (
        <Cell id={`${cellIdx}`} key={cellIdx} />
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
    </div>
  )
})

type BoxCoreProps = {
  children?: React.ReactNode
}

export const Boxes = memo(function BoxCore({ children }: BoxCoreProps) {
  const { ref, angle, isDragging, onMouseDown } = useDragRotate()
  // CSS `.box-content` là lưới 30×30 — phải đủ 900 ô, không cắt theo viewport. Cắt 484/225
  // để trống hàng rồi IntersectionObserver (bounding box TRƯỚC skew) nuốt nốt dấu cộng.
  const grids = useMemo(() => Array.from({ length: TOTAL_GRID }, (_, i) => i), [])
  const [scaleValue, setScaleValue] = useState(0.6)

  useLayoutEffect(() => {
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
      {/* Kéo xoay nền — pointer-only; không phải control form nên không gán role button. */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- drag surface, không phải click target */}
      <div ref={ref} style={styles} className='box-content' onMouseDown={onMouseDown}>
        {children}
        {/* Lưới + dấu cộng là TRANG TRÍ: ẩn khỏi cây a11y (900 grid × 4 nút đọc thành rác
            trên screen reader). display:contents để wrapper không thành grid item —
            .box-grid vẫn là con trực tiếp của lưới 30×30. Click chuột chơi note vẫn chạy. */}
        <div aria-hidden className='contents'>
          {grids.map((idx) => (
            <Grid key={idx} />
          ))}
        </div>
      </div>
      <div className='[WebkitMaskImage:radial-gradient(ellipse_at_center,transparent_50%,black)] pointer-events-none fixed inset-0 select-none backdrop-blur-sm [background:radial-gradient(ellipse_at_center,transparent_50%,hsl(var(--background)))] [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]' />
    </div>
  )
})
