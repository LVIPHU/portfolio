import { describe, expect, it } from 'vitest'
import { me, featuredProjects } from './me'
import { SKILL_IDS } from './skill-ids'
import { SKILL_CATEGORIES } from './types'
import type { Localized, SkillCategory } from './types'

const SKILL_CATS = new Set(SKILL_CATEGORIES.map((c) => c.id))
const ID_RE = /^[a-z0-9.+-]+$/
const FORBIDDEN = ['your-username', 'Sample Project', 'Company Name', 'example.com', 'Tên trường', 'PVS Solution', '…']
const LOCALIZED_EQUAL_WHITELIST = new Set(['Frontend Developer'])

function walkLocalized(value: unknown, acc: Localized[]) {
  if (!value || typeof value !== 'object') return
  if ('vi' in value && 'en' in value && typeof (value as Localized).vi === 'string') {
    acc.push(value as Localized)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) walkLocalized(item, acc)
    return
  }
  for (const v of Object.values(value)) walkLocalized(v, acc)
}

describe('me (T1)', () => {
  it('T1.1 skill ids unique and match /^[a-z0-9.+-]+$/', () => {
    const ids = me.skills.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) {
      expect(id).toMatch(ID_RE)
      expect(SKILL_IDS.includes(id), id).toBe(true)
    }
  })

  it('T1.2 every projects[].tech[] exists in me.skills', () => {
    const known = new Set(me.skills.map((s) => s.id))
    for (const project of me.projects) {
      for (const id of project.tech) {
        expect(known.has(id), `${project.slug} tech ${id}`).toBe(true)
      }
    }
  })

  it('T1.3 every products[].stack[] exists in me.skills', () => {
    const known = new Set(me.skills.map((s) => s.id))
    for (const company of me.experience) {
      for (const product of company.products) {
        for (const id of product.stack) {
          expect(known.has(id), `${product.id} stack ${id}`).toBe(true)
        }
      }
    }
  })

  it('T1.4 social ids are SkillId (ICONS resolution is T3.8 in @portfolio/icons)', () => {
    for (const social of me.profile.socials) {
      expect(SKILL_IDS.includes(social.id), `social ${social.id}`).toBe(true)
    }
  })

  it('T1.5 company/product date windows nest', () => {
    for (const company of me.experience) {
      if (company.end === null) expect(company.active).toBe(true)
      else expect(company.start <= company.end).toBe(true)
      for (const product of company.products) {
        expect(product.start >= company.start).toBe(true)
        if (product.end === null) {
          expect(company.end).toBeNull()
        } else {
          expect(company.end === null || product.end <= company.end).toBe(true)
          expect(product.start <= product.end).toBe(true)
        }
      }
    }
  })

  it('T1.6 exactly one active company (NEXSOFT); pinance inactive', () => {
    const active = me.experience.filter((c) => c.active)
    expect(active).toHaveLength(1)
    expect(active[0]?.name).toBe('NEXSOFT TECHNOLOGY')
    const pinance = me.experience.flatMap((c) => c.products).find((p) => p.id === 'pinance')
    expect(pinance?.active).toBe(false)
    expect(pinance?.end).toBe('2025-06')
  })

  it('T1.7 education is PTIT 2018-08 → 2022-12', () => {
    expect(me.education).toHaveLength(1)
    const edu = me.education[0]
    expect(edu?.school).toContain('PTIT')
    expect(edu?.start).toBe('2018-08')
    expect(edu?.end).toBe('2022-12')
  })

  it('T1.8 no placeholder strings', () => {
    const blob = JSON.stringify(me)
    for (const needle of FORBIDDEN) {
      expect(blob.includes(needle), needle).toBe(false)
    }
  })

  it('T1.9 Localized vi/en non-empty; vi !== en except whitelist', () => {
    const found: Localized[] = []
    walkLocalized(me, found)
    expect(found.length).toBeGreaterThan(0)
    for (const loc of found) {
      expect(loc.vi.trim().length).toBeGreaterThan(0)
      expect(loc.en.trim().length).toBeGreaterThan(0)
      if (LOCALIZED_EQUAL_WHITELIST.has(loc.vi) && loc.vi === loc.en) continue
      expect(loc.vi === loc.en, `vi===en: ${loc.en}`).toBe(false)
    }
  })

  it('T1.10 phoneHref and avatar URL', () => {
    expect(me.profile.phoneHref).toBe('tel:+' + me.profile.phone.replace(/\D/g, ''))
    expect(me.profile.avatar.includes('…')).toBe(false)
    expect(() => new URL(me.profile.avatar)).not.toThrow()
  })

  it('T1.11 every skill category is one of 9 and each has ≥1 skill', () => {
    const counts = new Map<SkillCategory, number>()
    for (const skill of me.skills) {
      expect(SKILL_CATS.has(skill.category), skill.category).toBe(true)
      counts.set(skill.category, (counts.get(skill.category) ?? 0) + 1)
    }
    for (const cat of SKILL_CATEGORIES) {
      expect((counts.get(cat.id) ?? 0) >= 1, cat.id).toBe(true)
    }
  })

  it('T1.12 portfolio-2026 / portfolio-2025 demo URLs', () => {
    const a = me.projects.find((p) => p.slug === 'portfolio-2026')
    const b = me.projects.find((p) => p.slug === 'portfolio-2025')
    expect(a?.links.demo).toBe('https://luongviphu.vercel.app/')
    expect(b?.links.demo).toBe('https://v1-luongviphu.vercel.app/about')
    expect(a?.links.source).toBe('https://github.com/LVIPHU/portfolio')
    expect(b?.links.source).toBe(a?.links.source)
  })

  it('T1.13 unique slugs; featuredProjects.length === 4', () => {
    const slugs = me.projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(featuredProjects).toHaveLength(4)
  })
})
