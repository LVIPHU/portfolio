'use client'

import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { cn } from '../lib/utils'

// C8 (D-04): registry Base UI không có drawer/vaul → port tay trên Dialog của
// @base-ui/react + trượt từ đáy bằng transform/transition (data-starting-style/
// data-ending-style). GIỮ NGUYÊN API surface bản vaul cũ để call site 2025 không đổi.

function Drawer({
  shouldScaleBackground: _shouldScaleBackground,
  ...props
}: DialogPrimitive.Root.Props & { shouldScaleBackground?: boolean }) {
  return <DialogPrimitive.Root data-slot='drawer' {...props} />
}

function DrawerTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot='drawer-trigger' {...props} />
}

function DrawerPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot='drawer-portal' {...props} />
}

function DrawerClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot='drawer-close' {...props} />
}

function DrawerOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot='drawer-overlay'
      className={cn(
        'fixed inset-0 z-50 bg-black/80 transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({ className, children, ...props }: DialogPrimitive.Popup.Props) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DialogPrimitive.Popup
        data-slot='drawer-content'
        className={cn(
          'bg-background fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border outline-none',
          'transition-transform duration-300 ease-out data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full',
          className
        )}
        {...props}
      >
        <div className='bg-muted mx-auto mt-4 h-2 w-[100px] rounded-full' />
        {children}
      </DialogPrimitive.Popup>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot='drawer-header' className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)} {...props} />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='drawer-footer' className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
}

function DrawerTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot='drawer-title'
      className={cn(
        'md:leading-14 text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-4xl',
        className
      )}
      {...props}
    />
  )
}

function DrawerDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot='drawer-description'
      className={cn('text-muted-foreground text-sm md:text-base', className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
