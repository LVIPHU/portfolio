import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/atoms'
import { Trans } from '@lingui/react/macro'
import { Facebook, Github } from 'lucide-react'
import Link from 'next/link'

export const AboutTemplate = () => {
  const navItems = [
    {
      title: <Trans>Facebook</Trans>,
      icon: <Facebook className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
      href: `https://www.facebook.com/phuphu.phang.54`
    },
    {
      title: <Trans>Github</Trans>,
      icon: <Github className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
      href: `https://github.com/LVIPHU`
    }
  ]
  return (
    <article>
      <div className={'mb-7'}>
        <Avatar className='h-60 w-60 mx-auto mb-2'>
          <AvatarImage src='/images/avatars/main.jpg' alt='@shadcn' />
          <AvatarFallback>{process.env.owner}</AvatarFallback>
        </Avatar>
        <p className='w-full text-center text-4xl font-bold'>{process.env.owner}</p>
        <p className='w-full text-center text-sm'>Software Engineer</p>
      </div>
      <address className={'flex gap-6 justify-center items-center'}>
        <Button variant={'default'}>
          <Trans>Resume</Trans>
        </Button>
        <Separator orientation={'vertical'} className={'h-6'} />
        {navItems.map((item, idx) => (
          <Link key={idx} href={item.href} target={'_blank'}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className={'rounded-full'} variant='outline' size='icon'>
                    {item.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        ))}
      </address>
      <Separator className={'my-8'} />
    </article>
  )
}
