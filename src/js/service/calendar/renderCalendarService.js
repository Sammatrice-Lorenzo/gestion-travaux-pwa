const getEventsFiltered = (events, currentTime) => {
    return events.filter(function (event) {
        const timeEvent = event.date.getTime()

        return (
            timeEvent >= currentTime &&
            timeEvent < currentTime + 24 * 60 * 60 * 1000
        )
    })
}

const buildEvent = (currentEvents, eventItems) => {
    for (const event of currentEvents) {
        eventItems.push({
            title: event.title,
            startTime: event.startHours,
            endTime: event.endHours,
            color: event.color,
        })
    }

    return eventItems
}

const renderEventsCalendar = (calendar, events, eventItems) => {
    const currentDate = calendar.value[0]
    const currentEvents = getEventsFiltered(events, currentDate.getTime())

    eventItems = []
    if (currentEvents.length) {
       eventItems = buildEvent(currentEvents, eventItems)
    }

    return eventItems
}


export { renderEventsCalendar }