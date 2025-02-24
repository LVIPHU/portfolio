import { cn } from '@/libs/utils'

type Props = {
  title: string
  className?: string
}

export const Header = (props: Props) => {
  const { title, className } = props
  return (
    <header>
      <h1 className={cn('', className)}>{title}</h1>
    </header>
  )
}
