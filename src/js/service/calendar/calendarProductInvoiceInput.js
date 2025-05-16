import Framework7DTO from '../../Framework7DTO'
import { monthsEnum } from '../../enum/monthEnum'

/**
 * @param { Framework7DTO } framework7DTO
 * @param { Date } date
 */
function createCalendar(framework7DTO, date, updateToolbar) {
  const $ = framework7DTO.getSelector()
  const $f7 = framework7DTO.getApp()
  const months = monthsEnum.getMonths()

  $f7.calendar.create({
    inputEl: '#calendar-input-product-invoice-file',
    openIn: 'customModal',
    header: false,
    days: false,
    footer: false,
    dateFormat: 'MM yyyy',
    value: [date],
    toolbarTemplate: () => getTemplateCalendar(),
    on: {
      init: (calendar) => {
        handleActionCalendar(calendar, framework7DTO, updateToolbar)
      },
      monthYearChangeStart: (calendar) => {
        updateToolbar(calendar, framework7DTO)
      },
      open: (calendar) => {
        const selector = $('#calendar-input-product-invoice-file')[0]
        if ($(selector).attr('month')) {
          const selectorMonth = $('.current-month-value')[0]
          const selectorYear = $('.current-year-value')[0]
          calendar.setValue([
            new Date(
              $(selector).attr('year'),
              months.indexOf($(selector).attr('month')),
              15,
            ),
          ])

          $(selectorMonth).text($(selector).attr('month').toLowerCase())
          $(selectorYear).text($(selector).attr('year'))

          $(calendar)
            .find('.calendar-next-month-button')
            .on('click', () => {
              calendar.currentMonth =
                months.indexOf($(selector).attr('month')) - 1
            })
        }
        hideMonthDaysInCalendar($)
      },
    },
  })
}

const hideMonthDaysInCalendar = ($) => {
  $('.calendar-months').css('display', 'none')
  $('.calendar-week-header').css('display', 'none')
  $('.calendar-modal.modal-in').css('height', '12%')
}

const handleActionCalendar = (calendar, framework7DTO, updateToolbar) => {
  updateToolbar(calendar, framework7DTO)
  const $ = framework7DTO.getSelector()
  $(calendar)
    .find('.calendar-custom-toolbar .left')
    .on('click', () => {
      calendar.prevYear()
    })
  $(calendar)
    .find('.calendar-custom-toolbar .right')
    .on('click', () => {
      calendar.nextYear()
    })
}

const getTemplateCalendar = () => {
  return `
        <div class="calendar-custom-toolbar">
            <div class="left">
                <a href="#" class="link icon-only"><i class="f7-icons">chevron_left</i></a>
            </div>
            <div class="center"></div>
            <div class="right">
                <a href="#" class="link icon-only"><i class="f7-icons">chevron_right</i></a>
            </div>
        </div>
    `
}

export { createCalendar }
