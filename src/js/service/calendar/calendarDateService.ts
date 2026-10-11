import type { Calendar } from 'framework7/components/calendar'

/**
 * First day of the month displayed by the calendar, as YYYY-MM-DD.
 * Built from local components (not toISOString) so it doesn't shift to
 * another day/month depending on the browser timezone.
 */
function getDateCalendarDefaultFormat(calendar: Calendar.Calendar): string {
  const month: string = String(calendar.currentMonth + 1).padStart(2, '0')

  return `${calendar.currentYear}-${month}-01`
}

export { getDateCalendarDefaultFormat }
