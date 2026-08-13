export function dateSortDesc(a: string, b: string) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export function sortByDateDesc<T extends { date: string }>(
  items: T[],
  dateKey: keyof T & string = 'date' as never
): T[] {
  return items.sort((a, b) => dateSortDesc(String(a[dateKey]), String(b[dateKey])))
}

/** Alias lịch sử 2025 (`sortPosts`). */
export const sortPosts = sortByDateDesc

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
}

export function formatDate(
  date: string | number | Date,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS
): string {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) {
    return typeof date === 'string' ? date : String(date)
  }
  return d.toLocaleDateString(locale, options)
}

function cycleCount(interval: number, cycle: number) {
  return cycle >= interval ? Math.floor(cycle / interval) : 0
}

/** Relative time in English (`a minute ago`, …). */
export function getTimeAgo(time: string | number | Date, now = Date.now()): string {
  const ms = typeof time === 'string' || time instanceof Date ? new Date(time).getTime() : time
  if (Number.isNaN(ms)) return typeof time === 'string' ? time : String(time)

  const secs = (now - ms) / 1000
  const mins = cycleCount(60, secs)
  const hours = cycleCount(60, mins)
  const days = cycleCount(24, hours)
  const weeks = cycleCount(7, days)
  const months = cycleCount(30, days)
  const years = cycleCount(12, months)

  let amt = years
  let cycle = 'year'

  if (secs <= 1) {
    return 'just now'
  }
  if (years > 0) {
    amt = years
    cycle = 'year'
  } else if (months > 0) {
    amt = months
    cycle = 'month'
  } else if (weeks > 0) {
    amt = weeks
    cycle = 'week'
  } else if (days > 0) {
    amt = days
    cycle = 'day'
  } else if (hours > 0) {
    amt = hours
    cycle = 'hour'
  } else if (mins > 0) {
    amt = mins
    cycle = 'minute'
  } else if (secs > 0) {
    amt = secs
    cycle = 'second'
  }

  const v = Math.floor(amt)

  return `${v === 1 ? (amt === hours ? 'an' : 'a') : v} ${cycle}${v > 1 ? 's' : ''} ago`
}
