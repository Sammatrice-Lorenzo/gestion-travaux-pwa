import { monthsEnum } from '../enum/monthEnum'

const formatDate = (date: string): string => {
  return new Date(date).toLocaleString([], {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

const getTime = (date: string): string => {
  return new Date(date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getMontYear = (date: Date | string) => {
  const adjustedDate = new Date(date)
  const month = monthsEnum.getMonths()[adjustedDate.getMonth()]

  return `${month} ${adjustedDate.getFullYear()}`
}

const toDatetimeLocalString = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * YYYY-MM-DD of the local calendar day. Unlike toISOString(), it doesn't
 * shift to the previous/next day depending on the browser timezone.
 */
const toDateLocalString = (date: Date): string => {
  return toDatetimeLocalString(date).slice(0, 10)
}

/**
 * Calendar day of a date-only API value ('2026-10-11T00:00:00+02:00') as a
 * local Date at midnight, so it is the same day whatever the browser timezone.
 */
const parseApiDate = (date: string | Date): Date => {
  if (date instanceof Date) return date

  const [year, month, day] = date.slice(0, 10).split('-').map(Number)

  return new Date(year, month - 1, day)
}

export {
  formatDate,
  getTime,
  getMontYear,
  parseApiDate,
  toDateLocalString,
  toDatetimeLocalString,
}
