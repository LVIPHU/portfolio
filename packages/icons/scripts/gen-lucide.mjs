/**
 * Sinh file lucide GSAP từ glyph lucide-react.
 * Animation viết lại bằng AnimatedIcon (không copy motion).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const lucideIconsDir = path.join(root, 'node_modules/lucide-react/dist/esm/icons')
const outDir = path.join(root, 'src/lucide')

/** file kebab → tên export (đúng 50 tên §4.4) */
const ICONS = [
  ['arrow-left', ['ArrowLeft']],
  ['arrow-right', ['ArrowRight']],
  ['book', ['Book']],
  ['check', ['Check', 'CheckIcon']],
  ['chevron-down', ['ChevronDownIcon']],
  ['chevron-left', ['ChevronLeft', 'ChevronLeftIcon']],
  ['chevron-right', ['ChevronRight', 'ChevronRightIcon']],
  ['chevron-up', ['ChevronUpIcon']],
  ['chevrons-up', ['ChevronsUp']],
  ['clock', ['Clock']],
  ['cloud-sun', ['CloudSun']],
  ['command', ['Command']],
  ['construction', ['Construction']],
  ['copy', ['Copy']],
  ['dot', ['Dot']],
  ['download', ['Download']],
  ['eye', ['Eye']],
  ['file-user', ['FileUser']],
  ['folder-git', ['FolderGit']],
  ['gallery-horizontal', ['GalleryHorizontal']],
  ['git-fork', ['GitFork']],
  ['house', ['House']],
  ['info', ['Info']],
  ['layers', ['Layers']],
  ['layout-grid', ['LayoutGrid']],
  ['link', ['Link']],
  ['list', ['List']],
  ['mail', ['Mail', 'MailIcon']],
  ['map-pin', ['MapPinIcon']],
  ['message-square-text', ['MessageSquareText']],
  ['monitor-cog', ['MonitorCog']],
  ['moon', ['Moon']],
  ['more-horizontal', ['MoreHorizontalIcon']],
  ['move-left', ['MoveLeft']],
  ['panel-bottom-close', ['PanelBottomClose']],
  ['panel-bottom-open', ['PanelBottomOpen']],
  ['paperclip', ['Paperclip']],
  ['phone', ['PhoneIcon']],
  ['search', ['Search']],
  ['share-2', ['Share2']],
  ['signature', ['Signature']],
  ['sun', ['Sun']],
  ['tags', ['Tags']],
  ['triangle-alert', ['TriangleAlert']],
  ['user', ['User']],
  ['x', ['XIcon']],
]

function resolveSource(filePath) {
  const source = fs.readFileSync(filePath, 'utf8')
  const reexport = source.match(/export \{ default \} from '\.\/([^']+)'/)
  if (reexport) {
    return resolveSource(path.join(path.dirname(filePath), reexport[1]))
  }
  return source
}

function parseIconNode(source) {
  const match = source.match(/const __iconNode = (\[[\s\S]*?\]);/)
  if (!match) throw new Error('no __iconNode')
  return Function(`"use strict"; return (${match[1]})`)()
}

function attrsToJsx(attrs) {
  const { key, ...rest } = attrs
  return Object.entries(rest)
    .map(([name, value]) => {
      if (typeof value === 'boolean') return value ? name : ''
      if (typeof value === 'number') return `${name}={${value}}`
      return `${name}=${JSON.stringify(String(value))}`
    })
    .filter(Boolean)
    .join(' ')
}

function nodesToJsx(nodes) {
  return nodes
    .map(([tag, attrs]) => {
      const a = attrsToJsx(attrs)
      return a ? `      <${tag} ${a} />` : `      <${tag} />`
    })
    .join('\n')
}

const header = `'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

`

const staticHeader = `import { forwardRef } from 'react'
import { StaticIcon, type StaticIconProps } from '../static-icon'

`

const barrel = []
const staticBarrel = []
const staticDir = path.join(outDir, 'static')
fs.mkdirSync(staticDir, { recursive: true })

for (const [kebab, names] of ICONS) {
  const srcPath = path.join(lucideIconsDir, `${kebab}.mjs`)
  if (!fs.existsSync(srcPath)) throw new Error(`missing lucide glyph: ${kebab}`)
  let nodes
  try {
    nodes = parseIconNode(resolveSource(srcPath))
  } catch (err) {
    throw new Error(`${kebab}: ${err.message}`)
  }
  const primary = names[0]
  const jsx = nodesToJsx(nodes)
  const aliases = names
    .slice(1)
    .map((alias) => `export { ${primary} as ${alias} }`)
    .join('\n')

  const file = `${header}export const ${primary} = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  function ${primary}(props, ref) {
    return (
      <AnimatedIcon ref={ref} {...props}>
${jsx}
      </AnimatedIcon>
    )
  },
)
${aliases ? `${aliases}\n` : ''}`

  const staticFile = `${staticHeader}export const ${primary} = forwardRef<SVGSVGElement, StaticIconProps>(
  function ${primary}(props, ref) {
    return (
      <StaticIcon ref={ref} {...props}>
${jsx}
      </StaticIcon>
    )
  },
)
${aliases ? `${aliases}\n` : ''}`

  fs.writeFileSync(path.join(outDir, `${kebab}.tsx`), file)
  fs.writeFileSync(path.join(staticDir, `${kebab}.tsx`), staticFile)
  barrel.push(`export { ${names.join(', ')} } from './${kebab}'`)
  staticBarrel.push(`export { ${names.join(', ')} } from './${kebab}'`)
}

fs.writeFileSync(
  path.join(outDir, 'index.ts'),
  `export type { AnimatedIconHandle, AnimatedIconProps } from './animated-icon'\n${barrel.join('\n')}\n`
)
fs.writeFileSync(
  path.join(staticDir, 'index.ts'),
  `export type { StaticIconProps } from '../static-icon'\n${staticBarrel.join('\n')}\n`
)

console.log(
  `wrote ${ICONS.length} animated + static icon files, ${ICONS.reduce((n, [, names]) => n + names.length, 0)} exports`
)
