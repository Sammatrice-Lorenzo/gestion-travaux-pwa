import { getTime } from '../date.js'

const getEventsFormatted = (workEventDays) => {
    return workEventDays.map(event => {
        const date = new Date(event.startDate)
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()
    
        return {
            id: event.id,
            date: new Date(year, month, day),
            title: event.title,
            startHours: getTime(event.startDate),
            endHours: getTime(event.endDate),
            color: event.color,
        }
    })
}

export { getEventsFormatted }
