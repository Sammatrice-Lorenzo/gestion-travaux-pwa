import Framework7DTO from "../../Framework7DTO"

const getBodyWorkDayCalendar = (form, date) => {
    return {
        date: date,
        startHours: form.startHour,
        endHours: form.endHour,
        title: form.title,
        color: form.color,
    }
}


const getElementEdit = (element) => {
    const target = element.target
    const liEvent = target.className === "f7-icons"
        ? target.parentElement.parentElement.parentElement
        : target.parentElement.parentElement

    const itemInnerEventTitle = liEvent.children[1]

    return itemInnerEventTitle.children[0].innerText
}

/**
 * @param { Framework7DTO } framework7DTO 
 */
const handleEditClassForm = (framework7DTO) => {
    const $ = framework7DTO.getSelector()

    framework7DTO.getApp().on('popupClosed', (popup) => {
        if ($(popup.el).hasClass('popup-swipe')) {
            $('#form-calendar').removeClass('edit');
        }
    })
}
/**
 * 
 * @param { string } title 
 * @param { Array } eventItems 
 * @param { Framework7DTO } framework7DTO 
 * @returns 
 */
const getEventSelected = (title, eventItems, framework7DTO) => {
    const $ = framework7DTO.getSelector()
    const formCalendar = eventItems.filter(event => event.title === title)[0]

    $('#form-calendar').addClass('edit')
    framework7DTO.getApp().form.fillFromData('#form-calendar', formCalendar)

    return formCalendar
}

export { getBodyWorkDayCalendar, getElementEdit, handleEditClassForm, getEventSelected }
