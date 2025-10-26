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
    .$('.calendar-custom-toolbar .center')
    .text(`${monthNames[calendar.currentMonth]}, ${calendar.currentYear}`)
  app.navbar.size(app.navbar.getElByPage(app.$el.value))
}

const initActionsToolbar = (
  calendar: Calendar.Calendar,
  app: Framework7,
): void => {
  app.$('.calendar-custom-toolbar .left .link').on('click', () => {
    calendar.prevMonth(1)
  })
  app.$('.calendar-custom-toolbar .right .link').on('click', () => {
    calendar.nextMonth(1)
  })
}

const toolbar = `
  <div class="toolbar calendar-custom-toolbar no-shadow bg-color-background">
    <div class="toolbar-inner">
      <div class="left">
        <a  class="link icon-only"><i class="icon icon-back color-white"></i></a>
      </div>
      <div class="center color-white" style="color: white; font-weight: bold;"></div>
      <div class="right">
        <a  class="link icon-only"><i class="icon icon-forward color-white"></i></a>
      </div>
    </div>
  </div>
`

const createCalendar = async (
  app: Framework7,
  renderEvents: CallableFunction,
  events: EventsInterface[],
): Promise<Calendar.Calendar> => {
  return app.calendar.create({
    containerEl: '#calendar',
    toolbar: true,
    value: [new Date()],
    events: events,
    renderToolbar: () => toolbar,
    on: {
      init: (calendar: Calendar.Calendar) => {
        initActionsToolbar(calendar, app)
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
