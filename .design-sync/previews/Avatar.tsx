import { Avatar, AvatarFallback, AvatarImage } from 'web-2025'

const row: React.CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }

const gradient = (from: string, to: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="128" height="128" fill="url(#g)"/></svg>`
  )

export const AuthorByline = () => (
  <div style={row}>
    <Avatar>
      <AvatarImage src="https://avatars.githubusercontent.com/u/84316006?v=4" alt="Lương Vĩ Phú" />
      <AvatarFallback>VP</AvatarFallback>
    </Avatar>
    <div>
      <p className="text-sm font-medium leading-none">Lương Vĩ Phú</p>
      <p className="text-muted-foreground text-xs">Frontend Engineer · Hồ Chí Minh</p>
    </div>
  </div>
)

const ringStyle: React.CSSProperties = { boxShadow: '0 0 0 2px var(--color-background)' }

export const TeamStack = () => (
  <div style={{ display: 'flex' }}>
    <Avatar style={ringStyle}>
      <AvatarImage src={gradient('#6366f1', '#0ea5e9')} alt="Cộng tác viên 1" />
      <AvatarFallback>P1</AvatarFallback>
    </Avatar>
    <Avatar style={{ ...ringStyle, marginLeft: -8 }}>
      <AvatarImage src={gradient('#f59e0b', '#ef4444')} alt="Cộng tác viên 2" />
      <AvatarFallback>P2</AvatarFallback>
    </Avatar>
    <Avatar style={{ ...ringStyle, marginLeft: -8 }}>
      <AvatarImage src={gradient('#10b981', '#14b8a6')} alt="Cộng tác viên 3" />
      <AvatarFallback>P3</AvatarFallback>
    </Avatar>
  </div>
)

export const Fallbacks = () => (
  <div style={row}>
    <Avatar>
      <AvatarFallback>VP</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>LN</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>+5</AvatarFallback>
    </Avatar>
  </div>
)

export const Sizes = () => (
  <div style={row}>
    <Avatar style={{ width: 24, height: 24 }}>
      <AvatarImage src={gradient('#6366f1', '#0ea5e9')} alt="nhỏ" />
      <AvatarFallback>S</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarImage src={gradient('#6366f1', '#0ea5e9')} alt="mặc định" />
      <AvatarFallback>M</AvatarFallback>
    </Avatar>
    <Avatar style={{ width: 48, height: 48 }}>
      <AvatarImage src={gradient('#6366f1', '#0ea5e9')} alt="lớn" />
      <AvatarFallback>L</AvatarFallback>
    </Avatar>
  </div>
)
