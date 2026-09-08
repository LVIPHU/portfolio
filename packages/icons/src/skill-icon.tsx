import { ICONS, type TypeOfIconsMap } from './map'

/** Skill trên CV không có SVG trong ICONS — fallback chữ, không nút rỗng. */
const PHI_ICON = new Set([
  'lighthouse',
  'wcag',
  'aria',
  'cicd',
  'testinglibrary',
  'jwt',
  'websocket',
  'cursor',
  'claudecode',
])

export function SkillIcon({ id, className }: { id: string; className?: string }) {
  if (id in ICONS) {
    const Icon = ICONS[id as TypeOfIconsMap]
    return <Icon className={className} />
  }
  if (PHI_ICON.has(id)) {
    return (
      <span className={className} aria-hidden>
        {id.slice(0, 2)}
      </span>
    )
  }
  return null
}
