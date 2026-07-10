import { Authors } from 'web-2025'

// Component chỉ đọc name / avatar / twitter từ CoreContent<Author>.
const avatarPhu = 'https://avatars.githubusercontent.com/u/84316006?v=4'

const avatarGuest =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f97316"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/><text x="40" y="52" font-family="system-ui" font-size="32" font-weight="700" fill="#fff" text-anchor="middle">Q</text></svg>`
  )

const phu = {
  name: 'Lương Vĩ Phú',
  avatar: avatarPhu,
  twitter: 'https://x.com/lviphu',
}

const quan = {
  name: 'Trần Minh Quân',
  avatar: avatarGuest,
  twitter: 'https://x.com/tmquan_dev',
}

const liGap = ".authors-fix li{gap:10px}"

export const SingleAuthor = () => (
  <><style>{liGap}</style><div className="authors-fix" style={{ maxWidth: 640, padding: 16 }}>
    <Authors authors={[phu] as any} />
  </div></>
)

export const CoAuthors = () => (
  <><style>{liGap}</style><div className="authors-fix" style={{ maxWidth: 640, padding: 16 }}>
    <Authors authors={[phu, quan] as any} />
  </div></>
)
