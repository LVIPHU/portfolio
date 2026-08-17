import { type ComponentProps, type ReactNode } from 'react'
import { Link } from '@portfolio/i18n/navigation'
import { clsx } from 'clsx'
import s from './pill-button.module.css'

// Nút chính kiểu lenis, dùng chung cho hero/footer của /about và cho header nổi.
// Nhãn phải nhân ĐÔI — hover tráo hai bản chứ không đổi màu một bản; bản dự bị aria-hidden
// để screen reader chỉ đọc một lần.
//
// Hai dạng dựng: <Link> khi có href (điều hướng nội bộ, locale-aware) và <button> khi có
// onClick. Không gộp thành một `as` prop vì kiểu props của hai thẻ lệch nhau, ép chung lại
// chỉ tổ mất kiểm tra kiểu.

type Common = {
  icon: ReactNode
  /** Bỏ trống = nút chỉ có icon (header dùng cho nút mở menu). */
  label?: string
  className?: string
}

function Inner({ icon, label }: Pick<Common, 'icon' | 'label'>) {
  return (
    <>
      <span className={s.btnIcon} aria-hidden>
        {icon}
      </span>
      {label && (
        <span className={s.btnLabel}>
          <span className={s.btnLabelVisible}>{label}</span>
          <span className={s.btnLabelHidden} aria-hidden>
            {label}
          </span>
        </span>
      )}
    </>
  )
}

function rootClass(label: string | undefined, className: string | undefined) {
  return clsx(s.btn, s.btnFilled, !label && s.btnIconOnly, className)
}

export function PillButtonLink({ href, icon, label, className }: Common & { href: string }) {
  return (
    <Link href={href} className={rootClass(label, className)}>
      <Inner icon={icon} label={label} />
    </Link>
  )
}

export function PillButton({
  icon,
  label,
  className,
  ...props
}: Common & Omit<ComponentProps<'button'>, 'className' | 'children'>) {
  return (
    <button type='button' className={rootClass(label, className)} {...props}>
      <Inner icon={icon} label={label} />
    </button>
  )
}
