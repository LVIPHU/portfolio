import { cn } from '@/libs/utils'
import { Separator } from '@/components/atoms'
import { Dot, GitFork } from 'lucide-react'
import Link from 'next/link'

type Props = {
  description: string
  className?: string
}

export const Footer = (props: Props) => {
  const itemsLeft = [
    {
      content: <>&copy; {new Date().getFullYear()}</>,
      href: null
    },
    null,
    {
      content: process.env.owner,
      href: '/'
    },
    null,
    {
      content: <GitFork size={14} />,
      href: 'https://github.com/LVIPHU/portfolio'
    }
  ]

  const itemsRight = [
    {
      content: 'Powered by',
      src: null,
      href: null
    },
    null,
    {
      content: 'tailwindcss',
      href: 'https://tailwindcss.com/'
    }
  ]

  const { className, description } = props
  return (
    <footer className={cn('text-sm mt-8 flex flex-col gap-y-5', className)}>
      <Separator />
      <p>
        <i>{description}</i>
      </p>
      <div className={'flex justify-between items-center text-sm'}>
        <ul className={'flex justify-center items-center gap-x-2'}>
          {itemsLeft.map((item, idx) =>
            item ? (
              <li key={idx}>
                {item.href ? (
                  <Link href={item.href} target={item.href.startsWith('http') ? '_blank' : '_self'}>
                    {item.content}
                  </Link>
                ) : (
                  item.content
                )}
              </li>
            ) : (
              <li key={idx}>
                <Dot size={14} />
              </li>
            )
          )}
        </ul>
        <ul className={'flex justify-center items-center gap-x-2'}></ul>
      </div>
    </footer>
  )
}
