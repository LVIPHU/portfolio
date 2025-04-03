'use client'

type ImageLoaderProps = {
  id: string
  export?: string
}

export function imageDriveLoader(props: ImageLoaderProps) {
  return `https://drive.google.com/uc?export=${props.export || 'view'}&id=${props.id}`
}
