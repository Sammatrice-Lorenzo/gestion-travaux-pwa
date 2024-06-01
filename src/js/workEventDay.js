import { apiRequest } from './api'
import { getToken } from './token'
import { getBodyWorkDayCalendar } from './service/calendar/calendarForm.js'
import * as messages from './messages'
import { getUrlByUser, getUrlUser, getUrl, getUrlById} from './urlGenerator'
import { clearCache, checkDataToGetOfAResponseCached, responseIsCached, stockResponseInCache } from './cache'

const URL_WORK_EVENT_DAY = '/api/work_event_day'
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


function createWorkEventDay(form, $f7, date)
{
    const url = getUrl(URL_WORK_EVENT_DAY)
    const body = JSON.stringify(getBodyWorkDayCalendar(form, date))

    apiRequest(url, 'POST', [body, URL_TO_REDIRECT], $f7)
}

function updateWorkEventDay(form, idWorkEventDay, $f7)
{
    const url = getUrlById(URL_WORK_EVENT_DAY, idWorkEventDay)
    const body = JSON.stringify(getBodyWorkDayCalendar(form, date))

    apiRequest(url, 'PUT', [body, URL_TO_REDIRECT], $f7)
}

export { createWorkEventDay, updateWorkEventDay }
