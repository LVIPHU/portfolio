'use client'

import dynamic from 'next/dynamic'
import type { SandpackFileMap } from './create-file-map'

// C11 (D-02 tầng 1 + D-06): next/dynamic ssr:false tách sandpack-root (+ sandpack-react)
// thành CHUNK RIÊNG — bài KHÔNG dùng <Sandpack> không tải sandpack (defaultMdxComponents
// tĩnh chỉ kéo file nhỏ này, phần nặng nằm sau dynamic). Cần sandpack-react trong
// transpilePackages của app thì dynamic mới resolve dưới Turbopack (ESM thô làm promise treo).
// Skeleton giữ ~420px chống CLS.
const SandpackRoot = dynamic(() => import('./sandpack-root'), {
  ssr: false,
  loading: () => <SandpackSkeleton />,
})

function SandpackSkeleton() {
  return (
    <div
      className='bg-muted/40 my-4 animate-pulse rounded-lg border'
      style={{ height: 420 }}
      aria-hidden
      data-sandpack-skeleton
    />
  )
}

export function SandpackClient({ files }: { files: SandpackFileMap }) {
  return (
    <div className='my-4' data-sandpack data-lenis-prevent>
      <SandpackRoot files={files} />
    </div>
  )
}
