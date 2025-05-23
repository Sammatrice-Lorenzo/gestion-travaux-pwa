import type { Calendar } from 'framework7/components/calendar'

function getDateCalendarDefaultFormat(calendar: Calendar.Calendar): string {
  const currentMonth: number = calendar.currentMonth + 1
  const currentYear: number = calendar.currentYear
  const date = new Date(currentYear, currentMonth)

  return date.toISOString().slice(0, 10)
}

export { getDateCalendarDefaultFormat }
