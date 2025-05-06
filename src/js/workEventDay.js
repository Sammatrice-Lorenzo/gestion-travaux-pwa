import { apiRequest, callAPI, deleteAPI, fetchFileAPI } from './api'
import { getUrl, getUrlById} from './urlGenerator'
import { checkDataToGetOfAResponseCached, responseIsCached } from './cache'
import { RouteDTO } from './dto/RouteDTO.js'
import Framework7DTO from './Framework7DTO.js'

const URL_WORK_EVENT_DAY = '/api/work_event_days/'
const URL_TO_REDIRECT = '/calendar/'

async function getWorkEventDayByUser($f7) {
    const urlWorkEventDay = URL_WORK_EVENT_DAY.slice(0, -1)
    const url = getUrl(urlWorkEventDay)

    const cache = await responseIsCached(url)
    if (cache) {
        return checkDataToGetOfAResponseCached(url)
    }

    return callAPI(url, $f7)
}

/**
 * 
 * @param { URL } url 
 * @param { String } method 
 * @param {*} $f7 
 * @param { Object } form 
 */
const handleCallAPI = (url, method, $f7, form) => {

    const body = getBody(form)

    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setRoute(URL_TO_REDIRECT)
        .setUrlAPI(url)
        .setBody(body)
        .setMethod(method)

    apiRequest(routeDTO)
}

function createWorkEventDay(form, $f7)
{
    const urlWorkEventDay = URL_WORK_EVENT_DAY.slice(0, -1)
    const url = getUrl(urlWorkEventDay)

    handleCallAPI(url, 'POST', $f7, form)
}

function updateWorkEventDay(form, idWorkEventDay, $f7)
{
    const url = getUrlById(URL_WORK_EVENT_DAY, idWorkEventDay)

    handleCallAPI(url, 'PUT', $f7, form)
}

function deleteWorkEventDay(idWorkEventDay, $f7) {
    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setIdElement(idWorkEventDay)
        .setRoute(URL_TO_REDIRECT)
        .setUrlAPI(URL_WORK_EVENT_DAY)

    deleteAPI(routeDTO)
}

/**
 * On ajoute plus deux aux date pour le format américain
 * 
 * @param { Object } body 
 * @returns 
 */
const getBody = (body) => {
    const date = body.date

    const [startHours, startMinutes] = body.startHours.split(':')
    const [endHours, endMinutes] = body.endHours.split(':')

    date.setHours(Number.parseInt(startHours) + 2, Number.parseInt(startMinutes))
    const startDate = new Date(date)

    date.setHours(Number.parseInt(endHours) + 2, Number.parseInt(endMinutes))
    const endDate = new Date(date)

    const json = {
        title: body.title,
        startDate: startDate,
        endDate: endDate,
        color: body.color,
        client: body.client.id !== '' ? `api/clients/${body.client.id}` : null
    }

    return JSON.stringify(json)
}

/**
 * @param { Framework7DTO } framework7DTO 
 * @returns { Boolean }
 */
function isValidForm(framework7DTO) {
    const $ = framework7DTO.getSelector()
    const $f7 = framework7DTO.getApp()

    const form = $('form#form-calendar')
    const inputs = $(form).find('input')

    let isValid = true

    for (const input of inputs) {
        const divParent = $(input).closest('.item-inner')
        if (input.value.trim() === '') {
            isValid = false
            const label = $(divParent).find('.item-title').text()
            $f7.dialog.alert(`${label} ne peut pas être vide.`)
        }
    }

    return isValid
}

function downloadCalendarEvents(calendar, $f7) {
    const currentMonth = calendar.currentMonth
    const currentYear = calendar.currentYear
    const date = new Date(currentYear, currentMonth).toLocaleDateString()
    const url = getUrl(`${URL_WORK_EVENT_DAY}file_download`)

    const [day, month, year] = date.split('/')
    const body = JSON.stringify({
        date: `${year}-${month}-${day}`,
    })

    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setUrlAPI(url)
        .setBody(body)
        .setMethod('POST')

    fetchFileAPI(routeDTO, `prestations_${date}.pdf`)
}

export { 
    getWorkEventDayByUser,
    createWorkEventDay,
    updateWorkEventDay,
    deleteWorkEventDay,
    isValidForm,
    downloadCalendarEvents
}
