'use client'

import dynamic from 'next/dynamic'
import type { SandpackFileMap } from './create-file-map'
import { SANDPACK_HEIGHT } from './constants'

// C11 (D-02 tầng 1 + D-06): next/dynamic ssr:false tách sandpack-root (+ sandpack-react)
// thành CHUNK RIÊNG — bài KHÔNG dùng <Sandpack> không tải sandpack (defaultMdxComponents
// tĩnh chỉ kéo file nhỏ này, phần nặng nằm sau dynamic). Cần sandpack-react trong
// transpilePackages của app thì dynamic mới resolve dưới Turbopack (ESM thô làm promise treo).
// Skeleton + shell cùng SANDPACK_HEIGHT chống CLS / giật Lenis.
const SandpackRoot = dynamic(() => import('./sandpack-root'), {
  ssr: false,
  loading: () => <SandpackSkeleton />,
})

function SandpackSkeleton() {
  return (
    <div
      className='bg-muted/40 h-full animate-pulse rounded-lg border'
      style={{ height: SANDPACK_HEIGHT }}
      aria-hidden
      data-sandpack-skeleton
    />
  )
}

export function SandpackClient({ files }: { files: SandpackFileMap }) {
  return (
    <div className='my-4' style={{ minHeight: SANDPACK_HEIGHT }} data-sandpack>
      <SandpackRoot files={files} />
    </div>
  )
}
