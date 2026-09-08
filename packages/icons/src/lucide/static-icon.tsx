import { forwardRef, type ReactNode, type SVGProps } from 'react'

export type StaticIconProps = Omit<SVGProps<SVGSVGElement>, 'ref'> & {
  size?: number
  children?: ReactNode
}

/** SVG lucide không GSAP — an toàn RSC (Dialog/Select/Pagination/MDX callout). */
export const StaticIcon = forwardRef<SVGSVGElement, StaticIconProps>(function StaticIcon(
  { size = 24, width, height, className, children, ...props },
  ref
) {
  return (
    <svg
      ref={ref}
      xmlns='http://www.w3.org/2000/svg'
      width={width ?? size}
      height={height ?? size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      {...props}
    >
      {children}
    </svg>
  )
})
