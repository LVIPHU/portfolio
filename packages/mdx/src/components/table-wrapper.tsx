import type { ComponentPropsWithoutRef } from 'react'

/** Bảng rộng cuộn ngang trong container riêng — body trang không bao giờ tràn. */
export function TableWrapper(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className='mdx-table-wrapper'>
      <table {...props} />
    </div>
  )
}
