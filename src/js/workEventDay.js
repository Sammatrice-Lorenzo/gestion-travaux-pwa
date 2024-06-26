import { apiRequest, deleteAPI, fetchFileAPI } from './api'
import { getToken } from './token'
import * as messages from './messages'
import { getUrlByUser, getUrlUser, getUrl, getUrlById} from './urlGenerator'
import { checkDataToGetOfAResponseCached, responseIsCached, stockResponseInCache } from './cache'
import { RouteDTO } from './dto/RouteDTO.js'
import Framework7DTO from './Framework7DTO.js'

const URL_WORK_EVENT_DAY = '/api/work_event_days/'
const URL_TO_REDIRECT = '/calendar/'
const URL_WORK_EVENT_DAY_BY_USER = '/api/work/event/day/'

export async function getWorkEventDayByUser($f7) {
    let eventsByUser = []
    const url = getUrlByUser(URL_WORK_EVENT_DAY_BY_USER)

    const cache = await responseIsCached(url)
    if (cache) {
        return checkDataToGetOfAResponseCached(url)
    }

    return callApi(eventsByUser, $f7)
}

async function callApi(eventsByUser, $f7) {
    const url = getUrlByUser(URL_WORK_EVENT_DAY_BY_USER)
    const token = getToken()

    await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response =>
        response
            .clone()
            .json()
            .then(function (data) {
                if (process.env.NODE_ENV === 'production') {
                    stockResponseInCache(url, response.clone())
                }

                if (data.code === 401) {
                    $f7.dialog.alert(messages.TOKEN_EXPIRED)
                    $f7.views.main.router.navigate('/')
                }

                for (const iterator of data["hydra:member"]) {
                    eventsByUser.push(iterator)
                }

                return eventsByUser
            })
    )
        .catch(error => {
            console.log(error)
        })

    return eventsByUser
}

function createWorkEventDay(form, $f7)
{
    const urlWorkEventDay = URL_WORK_EVENT_DAY.slice(0, -1)
    const url = getUrl(urlWorkEventDay)
    const body = getBody(form)

    apiRequest(url, 'POST', [body, URL_TO_REDIRECT], $f7)
}

function updateWorkEventDay(form, idWorkEventDay, $f7)
{
    const url = getUrlById(URL_WORK_EVENT_DAY, idWorkEventDay)
    const body = getBody(form)

    apiRequest(url, 'PUT', [body, URL_TO_REDIRECT], $f7)
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

    return JSON.stringify({
        title: body.title,
        startDate: startDate,
        endDate: endDate,
        color: body.color,
        user: urlUser
    })
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

export { createWorkEventDay, updateWorkEventDay, deleteWorkEventDay, isValidForm, downloadCalendarEvents }
