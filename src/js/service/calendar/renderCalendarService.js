import { URL_CLIENTS, URL_CLIENTS_BY_USER } from "../../client"
import { getUrlById } from "../../urlGenerator"

const getEventsFiltered = (events, currentTime) => {
    return events.filter(function (event) {
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
            const eventClient = event.client
            const hasClientEventDay = typeof eventClient === 'string' && eventClient.length > 0

            return {
                id: event.id,
                title: event.title,
                startTime: event.startHours,
                endTime: event.endHours,
                color: event.color,
                client: hasClientEventDay ? await findClient(event.client) : eventClient
            }
        })
    )
}

const renderEventsCalendar = async (calendar, events, eventItems) => {
    const currentDate = calendar.value[0]
    const currentEvents = getEventsFiltered(events, currentDate.getTime())

    eventItems = []
    if (currentEvents.length) {
        eventItems = await buildEvent(currentEvents)
    }

    return eventItems
}

async function findClient(route) {
    const routeSplit = route.split('/')
    const id = routeSplit.pop()
    const url = getUrlById(URL_CLIENTS, id)

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    
    const data = await response.json()

    return {
        "@id": `${URL_CLIENTS_BY_USER}${id}`,
        "name": data.name,
        "@type": data['@type']
    }
}

export { renderEventsCalendar }