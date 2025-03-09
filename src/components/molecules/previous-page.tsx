'use client'

import { useRouter } from 'next/navigation'
import { Button, Separator } from '@/components/atoms'
import { MoveLeft } from 'lucide-react'
import { Trans } from '@lingui/react/macro'

export const PreviousPage = () => {
  const router = useRouter()

  return (
    <nav className={'w-full'}>
      <Separator className={'my-8'} />
      <Button onClick={() => router.back()} variant={'ghost'}>
        <MoveLeft /> <Trans>Go back</Trans>
      </Button>
    </nav>
  )
}
