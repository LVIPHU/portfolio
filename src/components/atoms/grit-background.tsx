import { clsx } from 'clsx'

export function GritBackground({ className }: { className?: string }) {
  return (
    <div
      className={clsx([
        'absolute z-[-1]',
        'bg-cover bg-center',
        '[background-image:url("/static/images/backgrounds/black-grit.png")]',
        'dark:[background-image:url("/static/images/backgrounds/white-grit.png")]',
        className,
      ])}
    />
  )
}
