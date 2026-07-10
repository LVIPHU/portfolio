import * as React from 'react'

// Shim next/image cho môi trường ngoài Next (bundle DS) — render <img> thuần.
// Designs build bằng DS chạy trong browser thường, không có /_next/image optimizer.
const Image = React.forwardRef<HTMLImageElement, any>(function Image(
  {
    src,
    alt = '',
    fill,
    loader,
    quality,
    priority,
    placeholder,
    blurDataURL,
    unoptimized,
    onLoadingComplete,
    width,
    height,
    sizes,
    style,
    ...rest
  },
  ref
) {
  const resolved = typeof src === 'object' && src !== null ? ((src as any).src ?? '') : src
  const fillStyle: React.CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: (style as any)?.objectFit ?? 'cover' }
    : undefined
  return (
    <img
      ref={ref}
      src={resolved}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      style={{ ...fillStyle, ...style }}
      {...rest}
    />
  )
})

export default Image
