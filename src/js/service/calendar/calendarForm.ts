import type Framework7 from 'framework7'
import type ClientEventInterface from '../../../intefaces/WorkEventDay/ClientEventInterface'
import type EventsInterface from '../../../intefaces/WorkEventDay/EventInterface'
import type { EventItemInteface } from '../../../intefaces/WorkEventDay/EventItermInterface'
import type FormWorkEventDayInterface from '../../../intefaces/WorkEventDay/FormWorkEventDayInteface'

const getWorkDayCalendar = (
  form: FormWorkEventDayInterface,
  date: Date,
): EventsInterface => {
  const [id, name] = form.client.split('.')
  return {
    date,
    startHours: form.startHours,
    endHours: form.endHours,
    title: form.title,
    color: form.color,
    client: {
      id,
      name,
    },
  }
}

const getRowList = (target: HTMLElement): HTMLElement | null | undefined => {
  return target.className === 'f7-icons'
    ? target.parentElement?.parentElement?.parentElement
    : target.parentElement?.parentElement
}

const getElementEdit = (element: MouseEvent): string => {
  const target = element.target as HTMLElement

  const liEvent: HTMLElement | null | undefined = getRowList(target)
  if (!liEvent) throw new Error('liEvent not found')

  const itemInnerEventTitle = liEvent.children[1] as HTMLElement

  if (!itemInnerEventTitle || !itemInnerEventTitle.children[2]) {
    throw new Error('Target child not found')
  }

  return (itemInnerEventTitle.children[2] as HTMLElement).id
}

const handleEditClassForm = (app: Framework7): void => {
  const $ = app.$
  const selectorForm: string = '#form-calendar'
  const textCreation: string = 'Création nouveau événement'

  app.on(
    'popupClosed',
    (popup: {
      el: { classList: { contains: (arg0: string) => boolean } }
    }) => {
      if ($(popup.el).hasClass('popup-swipe')) {
        $(selectorForm).removeClass('edit')
        $(selectorForm).find('.block-title').children().text(textCreation)
        $('.title-popup').text(textCreation)
        $(selectorForm).find('input[name="title"]').val('')
        $(selectorForm).find('input[name="startHours"]').val('08:00')
        $(selectorForm).find('input[name="endHours"]').val('18:00')
        $(selectorForm).find('select[name="client"]').val('Aucun')
      }
    },
  )
}

type EventItemCalendar = FormWorkEventDayInterface & { id: number }

const getEventSelected = (
  id: number,
  eventItems: EventItemInteface[],
  app: Framework7,
): EventItemCalendar => {
  const $ = app.$
  const event: EventItemInteface = eventItems.filter(
    (event: EventItemInteface) => event.id === id,
  )[0]
  const client: ClientEventInterface | null = event.client
  const formCalendar: EventItemCalendar = {
    id: event.id,
    title: event.title,
    startHours: event.startTime,
    endHours: event.endTime,
    color: event.color,
    client: client ? `${client.id}.${client.name}` : '',
  }

  $('#form-calendar').addClass('edit')
  app.form.fillFromData('#form-calendar', formCalendar)

  return formCalendar
}

const getMaxId = (events: EventsInterface[]): number => {
  return events.reduce((maxId, event) => {
    return event.id !== undefined && event.id > maxId ? event.id : maxId
  }, Number.NEGATIVE_INFINITY)
}

export {
  getWorkDayCalendar,
  getElementEdit,
  handleEditClassForm,
  getEventSelected,
  getMaxId,
}
