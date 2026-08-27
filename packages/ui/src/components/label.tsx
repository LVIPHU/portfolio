'use client'

import * as React from 'react'

import { cn } from '@portfolio/utils'

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    // Primitive forward htmlFor/children từ caller — eslint không thấy association lúc định nghĩa.
    // eslint-disable-next-line jsx-a11y/label-has-associated-control -- htmlFor/children do consumer truyền
    <label
      data-slot='label'
      className={cn(
        'flex select-none items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Label }
