import type { Calendar } from 'framework7/components/calendar'
import type EventsInterface from '../../../intefaces/WorkEventDay/EventInterface'
import type { EventItemInteface } from '../../../intefaces/WorkEventDay/EventItermInterface'

const getEventsFiltered = (
  events: EventsInterface[],
  currentTime: number,
): EventsInterface[] => {
  return events.filter((event: EventsInterface) => {
    const timeEvent = new Date(event.date).getTime()

    return (
      timeEvent >= currentTime && timeEvent < currentTime + 24 * 60 * 60 * 1000
    )
  })
}

const buildEvent = async (
  currentEvents: EventsInterface[],
): Promise<EventItemInteface[]> => {
  return await Promise.all(
    currentEvents.map(async (event) => {
      return {
        id: event.id ?? 0,
        title: event.title,
        startTime: event.startHours,
        endTime: event.endHours,
        color: event.color,
        client: event.client,
      }
    }),
  )
}

const renderEventsCalendar = async (
  calendar: Calendar.Calendar,
  events: EventsInterface[],
): Promise<EventItemInteface[]> => {
  const currentDate: Date = calendar.value[0]
  const currentEvents = getEventsFiltered(events, currentDate.getTime())

  let newEventItems: EventItemInteface[] = []
  if (currentEvents.length) {
    newEventItems = await buildEvent(currentEvents)
  }

  return newEventItems
}

const showNameEvent = (event: EventItemInteface): string => {
  const client =
    event.client && event.client.id !== '' ? `(${event.client.name})` : ''

  return `${event.title} ${client}`
}

export { renderEventsCalendar, showNameEvent }
