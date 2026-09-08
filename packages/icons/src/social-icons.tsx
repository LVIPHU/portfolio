import { cn } from '@portfolio/utils'
import { ICONS, type TypeOfIconsMap } from './map'

type IconsBundleProps = {
  kind: TypeOfIconsMap | string
  href?: string | undefined
  size?: number
  hover?: boolean
  iconType?: 'link' | 'icon'
  className?: string
  parentClassName?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  text?: string
  strokeWidth?: number
}

export const SocialIcons = ({
  kind,
  href,
  size = 32,
  iconType = 'link',
  className,
  parentClassName,
  hover = true,
  target,
  text,
  strokeWidth,
}: IconsBundleProps) => {
  if (!(kind in ICONS)) return null
  const SocialSvg = ICONS[kind as TypeOfIconsMap]
  const box = { width: size, height: size }
  const combinedClass = cn(text ? 'mr-2' : '', className)
  const combinedParentClass = cn(
    'flex items-center justify-center',
    hover ? 'hover:text-sky-900 dark:hover:text-sky-900' : '',
    parentClassName
  )

  const safeHref = href && /^https?:\/\//i.test(href) ? href : undefined
  if (iconType === 'link' && safeHref) {
    return (
      <a
        href={safeHref}
        className={combinedParentClass}
        target={target ?? '_blank'}
        rel={target === '_self' ? undefined : 'noopener noreferrer'}
      >
        <span className='sr-only'>{kind}</span>
        <SocialSvg className={combinedClass} style={box} strokeWidth={strokeWidth} />
        {text}
      </a>
    )
  }
  return <SocialSvg className={combinedClass} style={box} strokeWidth={strokeWidth} />
}
