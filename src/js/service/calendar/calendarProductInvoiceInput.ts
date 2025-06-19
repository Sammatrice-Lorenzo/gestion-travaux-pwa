import type Framework7 from 'framework7'
import type { Calendar } from 'framework7/components/calendar'
import { monthsEnum } from '../../enum/monthEnum'
import type ToolbarCalendarProductInvoiceService from '../calendarProducInvoice/ToolbarCalendarProductInvoiceService'

function createCalendar(
  app: Framework7,
  date: Date,
  toolbarCalendarProductInvoiceService: ToolbarCalendarProductInvoiceService,
): void {
  app.calendar.create({
    inputEl: '#calendar-input-product-invoice-file',
    openIn: 'customModal',
    header: false,
    footer: false,
    dateFormat: 'MM yyyy',
    value: [date],
    on: {
      monthYearChangeStart: async (calendar: Calendar.Calendar) => {
        await toolbarCalendarProductInvoiceService.updateToolbar(app, calendar)
      },
      open: (calendar: Calendar.Calendar) => {
        actionsOpenCalendar(app, calendar)
      },
    },
  })
}

const hideMonthDaysInCalendar = (app: Framework7): void => {
  const $ = app.$
  $('.calendar-months').css('display', 'none')
  $('.calendar-week-header').css('display', 'none')
  $('.calendar-modal.modal-in').css('height', '12%')
}

const actionsOpenCalendar = (
  app: Framework7,
  calendar: Calendar.Calendar,
): void => {
  const months = monthsEnum.getMonths()
  const $ = app.$
  const selector = $('#calendar-input-product-invoice-file')[0]
  hideMonthDaysInCalendar(app)

  if ($(selector).attr('month')) {
    const year = Number.parseInt($(selector).attr('year'))
    const month = months.indexOf($(selector).attr('month')) + 1

    const date = new Date(`${year}-${month}-15`)
    calendar.setYearMonth(date.getFullYear(), date.getMonth(), 0)

    setTimeout(() => {
      calendar.setYearMonth(date.getFullYear(), date.getMonth(), 0)
    }, 50)
  }
}

export { createCalendar }
