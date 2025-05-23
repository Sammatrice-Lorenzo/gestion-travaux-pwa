import Framework7DTO from '../../Framework7DTO.js'
import { monthsEnum } from '../../enum/monthEnum.js'

/**
 * @param { import('framework7/components/calendar').Calendar.Calendar } calendar
 * @param { Framework7DTO } framework7DTO
 */
const updateNavbarCalendar = (calendar, framework7DTO) => {
  const $f7 = framework7DTO.app
  const monthNames = monthsEnum.getMonths()

  framework7DTO
    .selectorF7('.navbar-calendar-title')
    .text(`${monthNames[calendar.currentMonth]}, ${calendar.currentYear}`)
  $f7.navbar.size($f7.navbar.getElByPage(framework7DTO.domElement.value))
}

/**
 * @param { Framework7DTO } framework7DTO
 * @param { CallableFunction } renderEvents
 */
const createCalendar = async (framework7DTO, renderEvents, events) => {
  const $f7 = framework7DTO.app

  return $f7.calendar.create({
    containerEl: '#calendar',
    toolbar: false,
    value: [new Date()],
    events: events,
    on: {
      init: (calendar) => {
        updateNavbarCalendar(calendar, framework7DTO)
        calendar.$el.addClass('no-safe-area-right')
        renderEvents(calendar)
      },
      monthYearChangeStart: (calendar) => {
        updateNavbarCalendar(calendar, framework7DTO)
        renderEvents(calendar, true)
      },
      change: (calendar) => {
        renderEvents(calendar)
      },
    },
  })
}

export { createCalendar }
