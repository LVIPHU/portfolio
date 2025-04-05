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
import { useRouter } from 'next/navigation'
import { useMediaQuery } from '@/hooks'
import { createPortal } from 'react-dom'

export function Modal({
  children,
  title,
  description,
}: {
  children: React.ReactNode
  title?: string
  description?: string
}) {
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  function onDismiss(open: boolean) {
    if (!open) {
      router.back()
    }
  }
  if (isDesktop) {
    return createPortal(
      <Dialog defaultOpen={true} onOpenChange={onDismiss}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>,
      document.getElementById('modal-root')!
    )
  } else {
    return createPortal(
      <Drawer open={true} onOpenChange={onDismiss}>
        <DrawerContent className={'p-8'}>
          <DrawerHeader className={'px-0'}>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>,
      document.getElementById('modal-root')!
    )
  }
}
