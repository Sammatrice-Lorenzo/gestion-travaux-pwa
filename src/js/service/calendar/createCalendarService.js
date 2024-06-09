import Framework7DTO from '../../Framework7DTO.js'
import { monthsEnum } from '../../enum/monthEnum.js'


const updateNavbarCalendar = (calendar, framework7DTO) => {
    const $f7 = framework7DTO.app
    const monthNames = monthsEnum.getMonths()

    framework7DTO.selectorF7('.navbar-calendar-title').text(monthNames[calendar.currentMonth] + ', ' + calendar.currentYear)
    $f7.navbar.size($f7.navbar.getElByPage(framework7DTO.domElement.value))
}


/**
 * @param { Framework7DTO } framework7DTO 
 * @param { Date } today 
 * @param { CallableFunction } renderEvents 
 */
const createCalendar = async (framework7DTO, today, renderEvents, events) => {
    const $f7 = framework7DTO.app

    return $f7.calendar.create({
        containerEl: '#calendar',
        toolbar: false,
        value: [today],
        events: events,
        on: {
            init: function (calendar) {
                updateNavbarCalendar(calendar, framework7DTO)
                calendar.$el.addClass('no-safe-area-right')
                renderEvents(calendar)
            },
            monthYearChangeStart: function (calendar) {
                updateNavbarCalendar(calendar, framework7DTO)
            },
            change: function (calendar) {
                renderEvents(calendar)
            },
        }
    })
}

export { createCalendar }
