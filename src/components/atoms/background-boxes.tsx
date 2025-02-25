'use client'
import { memo, useState } from 'react'
import { cn } from '@/libs/utils'
import { useIsomorphicLayoutEffect } from '@/hooks'

const totalCols = 70
const totalRows = 70

const colors = ['lime', 'amber', 'sky']

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)]
}

type BoxCellProps = {
  i: number
  j: number
}

const BoxCell = memo(function BoxCell({ i, j }: BoxCellProps) {
  const [color, setColor] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  useIsomorphicLayoutEffect(() => {
    setColor(getRandomColor())
  }, [])

  return (
    <div
      className='border-r border-t border-slate-300 relative w-[70px] h-[35px]'
      style={
        {
          '--transition': isHovered ? `background 0s ease` : `background 2s ease`,
          backgroundColor: isHovered ? `var(--${color}-500)` : 'transparent',
          transition: 'opacity 250ms ease-out, var(--transition)'
        } as React.CSSProperties & { '--transition': string }
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {j % 2 === 0 && i % 2 === 0 && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='0.4'
          stroke='currentColor'
          className='absolute h-8 w-8 -top-[16px] -left-[16px] text-slate-600 pointer-events-none'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16M0 12h24' />
        </svg>
      )}
    </div>
  )
})

type BoxRowProps = {
  i: number
  cols: number[]
}

const BoxRow = memo(function BoxRow({ i, cols }: BoxRowProps) {
  return (
    <div className='border-l border-slate-300 relative w-[70px] h-[35px]'>
      {cols.map((_, j) => (
        <BoxCell key={`col-${j}`} i={i} j={j} />
      ))}
    </div>
  )
})

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = Array.from({ length: totalRows }, (_, i) => i)
  const cols = Array.from({ length: totalCols }, (_, i) => i)

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`
      }}
      className={cn(
        'absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0',
        className
      )}
      {...rest}
    >
      {rows.map((i) => (
        <BoxRow key={`row-${i}`} i={i} cols={cols} />
      ))}
    </div>
  )
}

export const Boxes = memo(BoxesCore)
