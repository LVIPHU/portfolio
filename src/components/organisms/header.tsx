import { Separator } from '@/components/atoms'

type Props = {
  title: string
  className?: string
  description?: string
}

export const Header = (props: Props) => {
  const { title, description, className } = props
  return (
    <header className={className}>
      <h1 className={'font-medium text-5xl'}>{title}</h1>
      {description && (
        <p>
          <i className={'text-sm'}>{description}</i>
        </p>
      )}
      <Separator className={'my-8'} />
    </header>
  )
}
