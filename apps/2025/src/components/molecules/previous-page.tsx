'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button, Separator } from '@/components/atoms'
import { MoveLeft } from 'lucide-react'
import { cn } from '@/utils'

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
