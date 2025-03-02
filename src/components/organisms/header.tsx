import { Separator } from '@/components/atoms'
import { cn } from '@/libs/utils'

type Props = {
  title: string
  className?: string
  description?: string
}

export const Header = (props: Props) => {
  const { title, description, className } = props
  return (
    <header className={cn('mb-8', className)}>
      <h1 className={'font-medium text-5xl'}>{title}</h1>
      {description && (
        <p>
          <i className={'text-sm'}>{description}</i>
        </p>
      )}
      <Separator className={'mt-8'} />
    </header>
  )
}
