'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/atoms'
import { useRouter } from '@portfolio/i18n/navigation'
import { useMediaQuery } from '@portfolio/hooks'
import { MEDIA } from '@/constants/breakpoints'

export function Modal({
  children,
  title,
  description,
  className,
}: {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}) {
  const router = useRouter()
  const isDesktop = useMediaQuery(MEDIA.lg, { initializeWithValue: false })
  function onDismiss(open: boolean) {
    if (!open) {
      router.back()
    }
  }
  if (isDesktop) {
    return (
      <Dialog defaultOpen={true} onOpenChange={onDismiss}>
        <DialogContent className={className}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    )
  } else {
    return (
      <Drawer open={true} onOpenChange={onDismiss}>
        <DrawerContent className={'p-8'}>
          <DrawerHeader className={'px-0'}>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    )
  }
}
