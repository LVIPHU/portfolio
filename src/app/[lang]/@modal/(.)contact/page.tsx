'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, Drawer, DrawerContent } from '@/components/atoms'
import { ContactTemplate } from '@/components/templates'
import { useRouter } from 'next/navigation'
import { useMediaQuery } from '@/hooks'
import { Trans } from '@lingui/react/macro'

export default function Contact() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const router = useRouter()
  function onDismiss(open: boolean) {
    if (!open) {
      router.back()
    }
  }
  if (isDesktop) {
    return (
      <Dialog defaultOpen={true} onOpenChange={onDismiss}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Trans>Contact</Trans>
            </DialogTitle>
          </DialogHeader>
          <ContactTemplate />
        </DialogContent>
      </Dialog>
    )
  } else {
    return (
      <Drawer open={true} onOpenChange={onDismiss}>
        <DrawerContent className={'p-8'}>
          <ContactTemplate />
        </DrawerContent>
      </Drawer>
    )
  }
}
