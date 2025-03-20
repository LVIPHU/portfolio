import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(timezone)
dayjs.extend(utc)

export const dayjsLocaleMap: Record<string, string> = {
  'en-US': 'en',
  'vi-VN': 'vi',
}

export const dayjsLocales: Record<string, () => Promise<ILocale>> = {
  'en-US': () => import('dayjs/locale/en'),
  'vi-VN': () => import('dayjs/locale/vi'),
}
