import { describe, expect, it } from 'vitest'
import { me } from './me'
import { resume } from './resume'
import { SITE_METADATA_2025 } from './site-metadata2025'
import { SKILL_CATEGORIES } from './types'

describe('resume + SITE_METADATA_2025 (T2)', () => {
  it('T2.1 resume.experience === me.experience (same reference)', () => {
    expect(resume.experience).toBe(me.experience)
  })

  it('T2.2 nine skill groups in SKILL_CATEGORIES order', () => {
    expect(resume.skills).toHaveLength(9)
    expect(resume.skills.map((g) => g.id)).toEqual(SKILL_CATEGORIES.map((c) => c.id))
  })

  it('T2.3 union of items === names of non-hidden skills', () => {
    const fromResume = new Set(resume.skills.flatMap((g) => g.items))
    const fromMe = new Set(me.skills.filter((s) => !s.hidden).map((s) => s.name))
    expect(fromResume).toEqual(fromMe)
  })

  it('T2.4 SITE_METADATA_2025 identity derives from me.profile', () => {
    const p = me.profile
    const github = p.socials.find((s) => s.id === 'github')?.url
    const facebook = p.socials.find((s) => s.id === 'facebook')?.url
    const linkedIn = p.socials.find((s) => s.id === 'linkedin')?.url
    expect(SITE_METADATA_2025.email).toBe(p.email)
    expect(SITE_METADATA_2025.phone).toBe(p.phone)
    expect(SITE_METADATA_2025.phoneHref).toBe(p.phoneHref)
    expect(SITE_METADATA_2025.location).toEqual(p.location)
    expect(SITE_METADATA_2025.avatar).toBe(p.avatar)
    expect(SITE_METADATA_2025.github).toBe(github)
    expect(SITE_METADATA_2025.facebook).toBe(facebook)
    expect(SITE_METADATA_2025.linkedIn).toBe(linkedIn)
    expect(SITE_METADATA_2025.resume).toBe(p.resumeUrl)
    expect(SITE_METADATA_2025.author).toBe(p.name)
  })
})
