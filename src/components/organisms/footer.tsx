import { cn } from '@/libs/utils'

type Props = {
  description: string
  className?: string
}

export const Footer = (props: Props) => {
  const { className, description } = props
  return (
    <footer className={cn('text-sm', className)}>
      <p>
        <i>{description}</i>
      </p>
      <br />
      <p>
        <strong>{process.env.owner}</strong>
      </p>
      <p>
        &copy; {new Date().getFullYear()} {process.env.owner}. All rights reserved!
      </p>
    </footer>
  )
}
