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
  'ja-JP': 'ja',
  'zh-TW': 'zh-tw',
  'zh-CN': 'zh-cn',
  'ko-KR': 'ko',
}

export const dayjsLocales: Record<string, () => Promise<ILocale>> = {
  'en-US': () => import('dayjs/locale/en'),
  'vi-VN': () => import('dayjs/locale/vi'),
  'ja-JP': () => import('dayjs/locale/ja'),
  'zh-TW': () => import('dayjs/locale/zh-tw'),
  'zh-CN': () => import('dayjs/locale/zh-cn'),
  'ko-KR': () => import('dayjs/locale/ko'),
}
