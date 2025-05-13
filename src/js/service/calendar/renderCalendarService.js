const getEventsFiltered = (events, currentTime) => {
    return events.filter((event) => {
        const timeEvent = new Date(event.date).getTime()

        return (
            timeEvent >= currentTime &&
            timeEvent < currentTime + 24 * 60 * 60 * 1000
        )
    })
}

const buildEvent = async (currentEvents) => {
    return await Promise.all(
        currentEvents.map(async (event) => {
            return {
                id: event.id,
                title: event.title,
                startTime: event.startHours,
                endTime: event.endHours,
                color: event.color,
                client: event.client
            }
        })
    )
}

const renderEventsCalendar = async (calendar, events, eventItems) => {
    const currentDate = calendar.value[0]
    const currentEvents = getEventsFiltered(events, currentDate.getTime())

    let newEventItems = eventItems
    if (currentEvents.length) {
        newEventItems = await buildEvent(currentEvents)
    }

    return newEventItems
}

const showNameEvent = (event) => {
    const client = event.client && event.client.id !== '' ? `(${event.client.name})` : ''
    
    return `${event.title} ${client}`
}

export { renderEventsCalendar, showNameEvent }