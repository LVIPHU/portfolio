import { cn } from '@/utils'

// SVG inline thay import qua @svgr/webpack (C7, D-05 — Turbopack không có webpack rule).
// Nguồn: public/static/images/backgrounds/grid.svg (pattern 72×56 + 2 rect nhấn).
export function GridBackground({ className }: { className?: string }) {
  return (
    <div className={cn(['absolute overflow-hidden [mask-image:linear-gradient(white,transparent)]', className])}>
      <svg
        aria-hidden='true'
        className={cn([
          'h-[160%] w-full',
          'absolute inset-x-0 inset-y-[-30%] skew-y-[-18deg]',
          'dark:fill-white/[.01] dark:stroke-white/[.025]',
          'fill-black/[0.02] stroke-black/5',
        ])}
      >
        <defs>
          <pattern id='grid-bg-pattern' width='72' height='56' patternUnits='userSpaceOnUse' x='50%' y='16'>
            <path d='M.5 56V.5H72' fill='none' />
          </pattern>
        </defs>
        <rect width='100%' height='100%' strokeWidth='0' fill='url(#grid-bg-pattern)' />
        <svg x='50%' y='16' className='overflow-visible'>
          <rect strokeWidth='0' width='73' height='57' x='0' y='56' />
          <rect strokeWidth='0' width='73' height='57' x='72' y='168' />
        </svg>
      </svg>
    </div>
  )
}
