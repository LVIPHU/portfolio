'use client'

import { useRouter } from 'next/navigation'
import { Button, Separator } from '@/components/atoms'
import { MoveLeft } from 'lucide-react'
import { Trans } from '@lingui/react/macro'
import { cn } from '@/libs/utils'

export const PreviousPage = ({ className }: { className?: string }) => {
  const router = useRouter()

  return (
    <nav className={cn('w-full', className)}>
      <Separator className={'my-5 md:my-10'} />
      <Button onClick={() => router.back()} variant={'ghost'}>
        <MoveLeft /> <Trans>Go back</Trans>
      </Button>
    </nav>
  )
}
