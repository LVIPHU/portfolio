import { cn } from '@/libs/utils'
import { Separator } from '@/components/atoms'

type Props = {
  title: string
  description?: string
  className?: string
}

export const Header = (props: Props) => {
  const { title, description, className } = props
  return (
    <header>
      <h1 className={cn('font-medium text-5xl', className)}>{title}</h1>
      {description && (
        <p>
          <i className={'text-sm'}>{description}</i>
        </p>
      )}
      <Separator className={'my-8'} />
    </header>
  )
}
