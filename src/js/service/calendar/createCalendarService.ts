import type Framework7 from 'framework7'
import type { Calendar } from 'framework7/components/calendar'
import type EventsInterface from '../../../intefaces/WorkEventDay/EventInterface.js'
import { monthsEnum } from '../../enum/monthEnum.js'

const updateNavbarCalendar = (
  calendar: Calendar.Calendar,
  app: Framework7,
): void => {
  const monthNames = monthsEnum.getMonths()

  app
    .$('.navbar-calendar-title')
    .text(`${monthNames[calendar.currentMonth]}, ${calendar.currentYear}`)
  app.navbar.size(app.navbar.getElByPage(app.$el.value))
}

const createCalendar = async (
  app: Framework7,
  renderEvents: CallableFunction,
  events: EventsInterface[],
): Promise<Calendar.Calendar> => {
  return app.calendar.create({
    containerEl: '#calendar',
    toolbar: false,
    value: [new Date()],
    events: events,
    on: {
      init: (calendar: Calendar.Calendar) => {
        updateNavbarCalendar(calendar, app)
        calendar.$el.addClass('no-safe-area-right')
        renderEvents(calendar)
      },
      monthYearChangeStart: (calendar: Calendar.Calendar) => {
        updateNavbarCalendar(calendar, app)
        renderEvents(calendar, true)
      },
      change: (calendar: Calendar.Calendar) => {
        renderEvents(calendar)
      },
    },
  })
}

export { createCalendar }
