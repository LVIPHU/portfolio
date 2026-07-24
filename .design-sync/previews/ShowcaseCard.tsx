import { ShowcaseCard } from 'web-2025'

// Thẻ vuông đánh số của rail kỹ năng ngang trên /about.
const row: React.CSSProperties = { display: 'flex', gap: 16, flexWrap: 'wrap' }
const cell: React.CSSProperties = { width: 190 }

export const SkillRail = () => (
  <div style={row}>
    <div style={cell}>
      <ShowcaseCard number={1} text='TypeScript' />
    </div>
    <div style={cell}>
      <ShowcaseCard number={2} text='Next.js' />
    </div>
    <div style={cell}>
      <ShowcaseCard number={3} text='Tailwind CSS' />
    </div>
  </div>
)

export const Inverted = () => (
  <div style={row}>
    <div style={cell}>
      <ShowcaseCard number={4} text='React' inverted />
    </div>
    <div style={cell}>
      <ShowcaseCard number={5} text='PostgreSQL' />
    </div>
  </div>
)
