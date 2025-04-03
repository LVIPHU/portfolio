import Grid from '@public/static/images/backgrounds/grid.svg'
import { cn } from '@/utils'

export function GridBackground({ className }: { className?: string }) {
  return (
    <div className={cn(['absolute overflow-hidden [mask-image:linear-gradient(white,transparent)]', className])}>
      <Grid
        className={cn([
          'h-[160%] w-full',
          'absolute inset-x-0 inset-y-[-30%] skew-y-[-18deg]',
          'dark:fill-white/[.01] dark:stroke-white/[.025]',
          'fill-black/[0.02] stroke-black/5',
        ])}
      />
    </div>
  )
}
