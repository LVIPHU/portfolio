import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { me } from '../../content/src/me'
import * as icons from './index'
import { ICONS, ReactIcon, SkillIcon, SocialIcons } from './index'

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

afterEach(() => cleanup())

describe('icons barrel (T3)', () => {
  it('T3.1 barrel does not export React; ReactIcon maps ICONS.react', () => {
    expect('React' in icons).toBe(false)
    expect(icons.ReactIcon).toBe(ReactIcon)
    expect(ICONS.react).toBe(ReactIcon)
  })

  it('T3.2 every me.skills id except phi-icon resolves in ICONS; sanity/stripe exist', () => {
    expect(ICONS.sanity).toBeTruthy()
    expect(ICONS.stripe).toBeTruthy()
    for (const skill of me.skills) {
      if (PHI_ICON.has(skill.id)) continue
      expect(skill.id in ICONS, `missing ICONS.${skill.id}`).toBe(true)
    }
  })

  it('T3.3 SkillIcon unknown id renders null', () => {
    const { container } = render(<SkillIcon id='khong-ton-tai' />)
    expect(container.firstChild).toBeNull()
  })

  it('T3.4 SocialIcons unknown → null; link has target+rel', () => {
    const unknown = render(<SocialIcons kind='khong-ton-tai' href='https://example.com' />)
    expect(unknown.container.firstChild).toBeNull()

    const { container } = render(<SocialIcons kind='github' iconType='link' href='https://github.com/LVIPHU' />)
    const a = container.querySelector('a')
    expect(a).toBeTruthy()
    expect(a?.getAttribute('href')).toBe('https://github.com/LVIPHU')
    expect(a?.getAttribute('target')).toBe('_blank')
    expect(a?.getAttribute('rel')).toContain('noopener')
  })

  it('T3.5 size sets inline width/height, not h-N class', () => {
    const { container } = render(<SocialIcons kind='github' iconType='icon' size={16} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('class') ?? '').not.toMatch(/\bh-16\b/)
    expect(svg?.style.width).toBe('16px')
    expect(svg?.style.height).toBe('16px')
  })

  it('T3.6 every ICONS entry renders one svg', () => {
    for (const [id, Icon] of Object.entries(ICONS)) {
      const { container, unmount } = render(<Icon />)
      expect(container.querySelectorAll('svg'), id).toHaveLength(1)
      unmount()
    }
  })

  it('T3.7 phi-icon SkillIcon renders text fallback, not null', () => {
    const { container } = render(<SkillIcon id='lighthouse' />)
    expect(container.textContent).toBe('li')
    expect(container.querySelector('svg')).toBeNull()
  })

  it('T3.8 social ids resolve in ICONS', () => {
    for (const social of me.profile.socials) {
      expect(social.id in ICONS, `social ${social.id}`).toBe(true)
    }
  })
})
