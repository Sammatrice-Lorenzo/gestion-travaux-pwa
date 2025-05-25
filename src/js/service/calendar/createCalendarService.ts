import type Framework7 from 'framework7'
import type { Calendar } from 'framework7/components/calendar'
import type EventsInterface from '../../../intefaces/WorkEventDay/EventInterface.js'
import type Framework7DTO from '../../Framework7DTO.js'
import { monthsEnum } from '../../enum/monthEnum.js'

const updateNavbarCalendar = (
  calendar: Calendar.Calendar,
  framework7DTO: Framework7DTO,
): void => {
  const $f7: Framework7 = framework7DTO.app
  const monthNames = monthsEnum.getMonths()

  framework7DTO
    .selectorF7('.navbar-calendar-title')
    .text(`${monthNames[calendar.currentMonth]}, ${calendar.currentYear}`)
  $f7.navbar.size($f7.navbar.getElByPage(framework7DTO.domElement.value))
}

const createCalendar = async (
  framework7DTO: Framework7DTO,
  renderEvents: CallableFunction,
  events: EventsInterface[],
): Promise<Calendar.Calendar> => {
  const $f7 = framework7DTO.app

  return $f7.calendar.create({
    containerEl: '#calendar',
    toolbar: false,
    value: [new Date()],
    events: events,
    on: {
      init: (calendar: Calendar.Calendar) => {
        updateNavbarCalendar(calendar, framework7DTO)
        calendar.$el.addClass('no-safe-area-right')
        renderEvents(calendar)
      },
      monthYearChangeStart: (calendar: Calendar.Calendar) => {
        updateNavbarCalendar(calendar, framework7DTO)
        renderEvents(calendar, true)
      },
      change: (calendar: Calendar.Calendar) => {
        renderEvents(calendar)
      },
    },
  })
}

export { createCalendar }
