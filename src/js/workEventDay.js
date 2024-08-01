import { apiRequest, callAPI, deleteAPI, fetchFileAPI } from './api'
import { getUrlByUser, getUrlUser, getUrl, getUrlById} from './urlGenerator'
import { checkDataToGetOfAResponseCached, responseIsCached, stockResponseInCache } from './cache'
import { RouteDTO } from './dto/RouteDTO.js'
import Framework7DTO from './Framework7DTO.js'

const URL_WORK_EVENT_DAY = '/api/work_event_days/'
const URL_TO_REDIRECT = '/calendar/'
const URL_WORK_EVENT_DAY_BY_USER = '/api/work/event/day/'

async function getWorkEventDayByUser($f7) {
    const url = getUrlByUser(URL_WORK_EVENT_DAY_BY_USER)

    const cache = await responseIsCached(url)
    if (cache) {
        return checkDataToGetOfAResponseCached(url)
    }

    return callAPI(URL_WORK_EVENT_DAY_BY_USER, $f7)
}

function createWorkEventDay(form, $f7)
{
    const urlWorkEventDay = URL_WORK_EVENT_DAY.slice(0, -1)
    const url = getUrl(urlWorkEventDay)
    const body = getBody(form)

    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setRoute(URL_TO_REDIRECT)
        .setUrlAPI(url)
        .setBody(body)
        .setMethod('POST')

    apiRequest(routeDTO)
}

function updateWorkEventDay(form, idWorkEventDay, $f7)
{
    const url = getUrlById(URL_WORK_EVENT_DAY, idWorkEventDay)
    const body = getBody(form)

    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setRoute(URL_TO_REDIRECT)
        .setUrlAPI(url)
        .setBody(body)
        .setMethod('PUT')
    
    apiRequest(routeDTO)
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
    const urlUser = getUrlUser()
    let date = body.date

    const [startHours, startMinutes] = body.startHours.split(':')
    const [endHours, endMinutes] = body.endHours.split(':')

    date.setHours(parseInt(startHours) + 2, parseInt(startMinutes))
    const startDate = new Date(date)

    date.setHours(parseInt(endHours) + 2, parseInt(endMinutes))
    const endDate = new Date(date)

    let json = {
        title: body.title,
        startDate: startDate,
        endDate: endDate,
        color: body.color,
        user: urlUser,
        client: body.client !== '' ? body.client : null
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

    inputs.forEach(function(input) {
        const divParent = $(input).closest('.item-inner')
        if (input.value.trim() === '') {
            isValid = false
            const label = $(divParent).find('.item-title').text()
            $f7.dialog.alert(`${label} ne peut pas être vide.`)
        }
    })

    return isValid
}


function downloadCalendarEvents(calendar, $f7) {
    const currentMonth = calendar.currentMonth
    const currentYear = calendar.currentYear

    const body = JSON.stringify({
        date: new Date(currentYear, currentMonth).toLocaleDateString(),
    })

    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setUrlAPI('/api/work-event-day/file')
        .setBody(body)

    fetchFileAPI(routeDTO, 'summary_events.pdf')
}

export { 
    getWorkEventDayByUser,
    createWorkEventDay,
    updateWorkEventDay,
    deleteWorkEventDay,
    isValidForm,
    downloadCalendarEvents
}
