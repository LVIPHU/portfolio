import { Separator } from '@/components/atoms'
import { cn } from '@portfolio/utils'

type Props = {
  title: string
  className?: string
  description?: string
  children?: React.ReactNode
}

export const Header = (props: Props) => {
  const { title, description, className, children } = props
  return (
    <div className={cn('mb-5 flex flex-col md:mb-10', className)}>
      <h1 className='heading-page'>{title}</h1>
      {description && (
        <p className={'mt-3 md:mt-5'}>
          <i className={'text-base text-gray-500 md:text-lg md:leading-7 dark:text-gray-400'}>{description}</i>
        </p>
      )}
      {children && <div className={'mt-3 flex items-center justify-between md:mt-5'}>{children}</div>}
      <Separator className={'mt-5 md:mt-10'} />
    </div>
  )
}
