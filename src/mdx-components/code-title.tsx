import { SocialIcons, TypeOfIconsMap } from '@/components/atoms'
import { CopyCodeButton } from './copy-code-button'
import { cn } from '@/utils'

const LANGS_MAP: Record<string, TypeOfIconsMap> = {
  js: 'javascript',
  jsx: 'react',
  ts: 'typescript',
  tsx: 'react',
  css: 'css',
  html: 'html',
  json: 'javascript',
}

const FILE_NAME_MAP: Record<string, TypeOfIconsMap> = {
  'tailwind.config.js': 'tailwindcss',
  '.gitignore': 'git',
}

export function CodeTitle({ lang, title }: { lang: string; title: string }) {
  return (
    <div
      className={cn([
        'remark-code-title',
        'flex items-center gap-2.5 truncate px-4 py-1 lg:py-2',
        'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300',
        'rounded-t-lg border border-gray-100 dark:border-gray-700',
      ])}
    >
      <SocialIcons
        kind={FILE_NAME_MAP[title] || LANGS_MAP[lang]}
        iconType='icon'
        className='h-5 w-5 shrink-0 rounded'
      />
      <span className='truncate font-mono text-sm font-medium'>{title}</span>
      <CopyCodeButton parent='code-title' className='-mr-2 ml-auto bg-transparent dark:bg-transparent' />
    </div>
  )
}
