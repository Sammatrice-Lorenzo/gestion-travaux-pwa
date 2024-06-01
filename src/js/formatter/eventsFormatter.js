import { getTime } from '../date.js'

const getEventsFormatted = (workEventDays) => {
    let events = []
    for (const event of workEventDays) {
        events.push({
            date: new Date(event.endDate),
            title: event.title,
            startHours: getTime(event.startDate),
            endHours: getTime(event.endDate),
            color: event.color,
        })
    }

    return events
}

export { getEventsFormatted }