import { me, skillNames } from './me'
import { SKILL_CATEGORIES } from './types'
import type { ResumeData } from './types'

/** View dẫn xuất — không nhân bản dữ liệu. `experience` là cùng reference với `me.experience`. */
export const resume: ResumeData = {
  experience: me.experience,
  education: me.education,
  skills: SKILL_CATEGORIES.map((cat) => ({
    id: cat.id,
    label: cat.label,
    items: me.skills.filter((skill) => skill.category === cat.id && !skill.hidden).map((skill) => skill.name),
  })),
}

export { skillNames }
