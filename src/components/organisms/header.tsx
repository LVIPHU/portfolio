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
    <div className={cn('mb-5 flex flex-col md:mb-10', className)}>
      <h1
        className={
          'md:leading-14 text-3xl font-extrabold leading-9 tracking-tight sm:text-4xl sm:leading-10 md:text-6xl'
        }
      >
        {title}
      </h1>
      {description && (
        <p className={'mt-3 md:mt-5'}>
          <i className={'text-base text-gray-500 dark:text-gray-400 md:text-lg md:leading-7'}>{description}</i>
        </p>
      )}
      <Separator className={'mt-5 md:mt-10'} />
    </div>
  )
}
