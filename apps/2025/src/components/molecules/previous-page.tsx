'use client'

import { Button, Separator } from '@portfolio/ui'
import { useRouter } from '@portfolio/i18n/navigation'
import { useTranslations } from 'next-intl'
import { MoveLeft } from '@portfolio/icons/lucide'
import { cn } from '@portfolio/utils'

export const PreviousPage = ({ className }: { className?: string }) => {
  const router = useRouter()
  const t = useTranslations()

  return (
    <nav className={cn('w-full', className)}>
      <Separator className={'my-5 md:my-10'} />
      <Button onClick={() => router.back()} variant={'ghost'}>
        <MoveLeft /> {t('PreviousPage.goBack')}
      </Button>
    </nav>
  )
}
