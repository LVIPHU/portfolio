import { MoveLeft } from 'lucide-react'
import { GrowingUnderline, NavigationLink } from '@/components/atoms'

export function BackToPosts({ label, className }: { label: string; className?: string }) {
  return (
    <div className={className}>
      <NavigationLink href='/blog' className='flex w-fit items-center gap-3 font-medium'>
        <MoveLeft strokeWidth={1.5} />
        <GrowingUnderline data-umami-event='discuss-on-x'>{label}</GrowingUnderline>
      </NavigationLink>
    </div>
  )
}
