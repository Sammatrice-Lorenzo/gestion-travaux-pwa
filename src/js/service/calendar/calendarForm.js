import Framework7DTO from "../../Framework7DTO"

const getWorkDayCalendar = (form, date) => {
    const [id, name] = form.client.split('.')
    
    return {
        date: date,
        startHours: form.startHour,
        endHours: form.endHour,
        title: form.title,
        color: form.color,
        client: {
            id,
            name
        }
    }
}

const getElementEdit = (element) => {
    const target = element.target
    const liEvent = target.className === "f7-icons"
        ? target.parentElement.parentElement.parentElement
        : target.parentElement.parentElement

    const itemInnerEventTitle = liEvent.children[1]

    return itemInnerEventTitle.children[2].id
}

/**
 * @param { Framework7DTO } framework7DTO 
 */
const handleEditClassForm = (framework7DTO) => {
    const $ = framework7DTO.getSelector()
    const selectorForm = '#form-calendar'
    const textCreation = 'Création nouveau événement'

    framework7DTO.getApp().on('popupClosed', (popup) => {
        if ($(popup.el).hasClass('popup-swipe')) {
            $(selectorForm).removeClass('edit')

            $(selectorForm).find('.block-title').children().text(textCreation)
            $('.title-popup').text(textCreation)
            $(selectorForm).find('input[name="title"]').val('')
            $(selectorForm).find('input[name="startHour"]').val('08:00')
            $(selectorForm).find('input[name="endHour"]').val('18:00')
            $(selectorForm).find('select[name="client"]').val('Aucun')
        }
    })
}
/**
 * 
 * @param { number } id 
 * @param { Array } eventItems 
 * @param { Framework7DTO } framework7DTO 
 * @returns 
 */
const getEventSelected = (id, eventItems, framework7DTO) => {
    const $ = framework7DTO.getSelector()
    const event = eventItems.filter(event => event.id === id)[0]
    const client = event.client

    const formCalendar = {
        id: event.id,
        title: event.title,
        startHour: event.startTime,
        endHour: event.endTime,
        color: event.color,
        client: client ? `${client.id}.${client.name}` : ''
    }

    $('#form-calendar').addClass('edit')
    framework7DTO.getApp().form.fillFromData('#form-calendar', formCalendar)

    return formCalendar
}

/**
 * @param { Array } events 
 * @returns { number }
 */
const getMaxId = (events) => {
    return events.reduce((maxId, event) => {
        return event.id > maxId ? event.id : maxId
    }, Number.NEGATIVE_INFINITY)
}

export { getWorkDayCalendar, getElementEdit, handleEditClassForm, getEventSelected, getMaxId }
