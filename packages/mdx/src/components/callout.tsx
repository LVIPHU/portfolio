import type { ReactNode } from 'react'
import { Construction, Info, Layers, TriangleAlert } from 'lucide-react'

export type CalloutVariant = 'note' | 'pitfall' | 'deep-dive' | 'wip'

/** variantMap kiểu ExpandableCallout của react.dev (M-03, D-11) */
const variantMap = {
  note: { label: 'Ghi chú', Icon: Info, className: 'callout-note' },
  pitfall: { label: 'Cạm bẫy', Icon: TriangleAlert, className: 'callout-pitfall' },
  'deep-dive': { label: 'Đào sâu', Icon: Layers, className: 'callout-deep-dive' },
  wip: { label: 'Đang viết', Icon: Construction, className: 'callout-wip' },
} satisfies Record<CalloutVariant, { label: string; Icon: typeof Info; className: string }>

export interface CalloutProps {
  type?: CalloutVariant
  title?: string
  children?: ReactNode
}

/**
 * Server component — 0 JS. Biến thể deep-dive dùng details/summary HTML thuần
 * (D-10: ưu tiên 0 JS thay vì island expand).
 */
export function Callout({ type = 'note', title, children }: CalloutProps) {
  const variant = variantMap[type] ?? variantMap.note
  const { label, Icon, className } = variant
  const heading = (
    <span className='mdx-callout-heading'>
      <Icon aria-hidden className='mdx-callout-icon' />
      {title ?? label}
    </span>
  )

  if (type === 'deep-dive') {
    return (
      <details className={`mdx-callout ${className}`}>
        <summary>{heading}</summary>
        <div className='mdx-callout-body'>{children}</div>
      </details>
    )
  }

  return (
    <aside className={`mdx-callout ${className}`}>
      {heading}
      <div className='mdx-callout-body'>{children}</div>
    </aside>
  )
}
