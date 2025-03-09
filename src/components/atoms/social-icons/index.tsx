import {
  NextJs,
  Tailwind,
  TypeScript,
  ShadCn,
  Mongodb,
  Prisma,
  CSS,
  HTML,
  GraphQL,
  JavaScript,
  Jira,
  NodeJs,
  Postgres,
  Python,
  React,
  Vercel,
  Vite,
  Yarn,
  Git,
  BootStrap,
  Postman,
  ThreeJS,
  MySQL,
  PNPM,
  FramerMotion,
  NestJS,
  Vuejs,
  Expressjs,
  Umami,
  DataDog,
  Github,
  AntDesign
} from './icons'

import { NavigationLink } from '@/components/atoms'
import { Button } from '@/components/atoms'
import { cn } from '@/libs/utils'
import { GitFork } from 'lucide-react'

const components = {
  gitfork: GitFork,
  javascript: JavaScript,
  typescript: TypeScript,
  react: React,
  vuejs: Vuejs,
  nextjs: NextJs,
  tailwindcss: Tailwind,
  bootstrap: BootStrap,
  shadcn: ShadCn,
  antd: AntDesign,
  css: CSS,
  html: HTML,
  graphql: GraphQL,
  prisma: Prisma,
  python: Python,
  nodejs: NodeJs,
  expressjs: Expressjs,
  nestjs: NestJS,
  git: Git,
  github: Github, // Vì không có icon Github riêng, Git có thể dùng thay thế
  mongodb: Mongodb,
  postgres: Postgres,
  mysql: MySQL,
  postman: Postman,
  vercel: Vercel,
  vite: Vite,
  threejs: ThreeJS,
  framermotion: FramerMotion,
  pnpm: PNPM, // Dù hidden, nhưng nếu cần có thể giữ lại
  yarn: Yarn, // Hidden nhưng có thể giữ lại nếu muốn
  jira: Jira, // Hidden nhưng nếu cần, có thể giữ lại
  umami: Umami,
  datadog: DataDog
}

type IconsBundleProps = {
  kind: keyof typeof components | string
  href?: string | undefined
  size?: number
  hover?: boolean
  iconType?: 'button' | 'link' | 'icon'
  variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  className?: string
  parentClassName?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  text?: string
  strokeWidth?: number
}

export const SocialIcons = ({
  kind,
  href,
  size = 8,
  iconType = 'link',
  variant = 'outline',
  className,
  parentClassName,
  hover = true,
  target,
  text,
  strokeWidth
}: IconsBundleProps) => {
  const SocialSvg = components[kind as keyof typeof components]

  // check if kind already exists in the components object
  if (!(kind in components)) {
    return null
  }

  const combinedClass = cn(`${text ? 'mr-2' : ''}  h-${size} w-${size}`, className)

  const combinedParentClass = cn(
    'flex items-center justify-center',
    `${hover ? 'hover:text-sky-900 dark:hover:text-sky-900' : ''}`,
    parentClassName
  )

  if (iconType === 'button') {
    return (
      <Button variant={variant} size={!text ? 'icon' : 'default'} className={combinedParentClass} asChild>
        <NavigationLink href={href} target={target}>
          <span className='sr-only'>{kind}</span>
          <SocialSvg className={combinedClass} strokeWidth={strokeWidth} />
          {text}
        </NavigationLink>
      </Button>
    )
  }

  if (iconType === 'link') {
    return (
      <NavigationLink href={href} className={combinedParentClass} target={target}>
        <span className='sr-only'>{kind}</span>
        <SocialSvg className={combinedClass} strokeWidth={strokeWidth} />
        {text}
      </NavigationLink>
    )
  }
  return <SocialSvg className={cn(`h-${size} w-${size}`, className)} strokeWidth={strokeWidth} />
}
