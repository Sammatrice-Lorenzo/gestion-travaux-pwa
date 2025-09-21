import Framework7 from 'framework7'
import { checkDataToGetOfAResponseCached, responseIsCached } from './cache'
import { RouteDTO } from './dto/RouteDTO.js'
import { ApiMutationService } from './service/api/ApiMutationService.ts'
import { ApiService } from './service/api/ApiService.ts'
import { getDateCalendarDefaultFormat } from './service/calendar/calendarDateService.ts'
import { getUrl, getUrlById, getUrlWithParameters } from './urlGenerator'

const URL_WORK_EVENT_DAY = '/api/work_event_days/'
const URL_TO_REDIRECT = '/calendar/'

/**
 * @param { Framework7 } $f7
 * @param { import('framework7/components/calendar').Calendar.Calendar | null } calendar
 */
async function getWorkEventDayByUser($f7, calendar = null) {
  const date = calendar
    ? getDateCalendarDefaultFormat(calendar)
    : new Date().toISOString().slice(0, 10)
  const urlWorkEventDay = URL_WORK_EVENT_DAY.slice(0, -1)
  const url = getUrlWithParameters(urlWorkEventDay, { date })

  const cache = await responseIsCached(url)
  if (cache) {
    return checkDataToGetOfAResponseCached(url)
  }

  return new ApiService($f7).call(url)
}

/**
 *
 * @param { URL } url
 * @param { String } method
 * @param {*} $f7
 * @param { Object } form
 */
const handleCallAPI = async (url, method, $f7, form) => {
  const body = getBody(form)

  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setRoute(URL_TO_REDIRECT)
    .setUrlAPI(url)
    .setBody(body)
    .setMethod(method)

  await new ApiMutationService($f7).generic(routeDTO)
}

async function createWorkEventDay(form, $f7) {
  const urlWorkEventDay = URL_WORK_EVENT_DAY.slice(0, -1)
  const url = getUrl(urlWorkEventDay)

  await handleCallAPI(url, 'POST', $f7, form)
}

async function updateWorkEventDay(form, idWorkEventDay, $f7) {
  const url = getUrlById(URL_WORK_EVENT_DAY, idWorkEventDay)

  await handleCallAPI(url, 'PUT', $f7, form)
}

async function deleteWorkEventDay(idWorkEventDay, $f7) {
  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setIdElement(idWorkEventDay)
    .setRoute(URL_TO_REDIRECT)
    .setUrlAPI(URL_WORK_EVENT_DAY)

  await new ApiMutationService($f7).delete(routeDTO)
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

  date.setHours(Number.parseInt(startHours), Number.parseInt(startMinutes))
  const startDate = new Date(date).toISOString()

  date.setHours(Number.parseInt(endHours), Number.parseInt(endMinutes))
  const endDate = new Date(date).toISOString()

  const json = {
    title: body.title,
    startDate: startDate,
    endDate: endDate,
    color: body.color,
    client: body.client.id !== '' ? `api/clients/${body.client.id}` : null,
  }

  return JSON.stringify(json)
}

/**
 * @param { import('framework7/components/calendar').Calendar.Calendar } calendar
 * @param { Framework7 } $f7
 */
async function downloadCalendarEvents(calendar, $f7) {
  const date = getDateCalendarDefaultFormat(calendar)

  const url = getUrl(`${URL_WORK_EVENT_DAY}file_download`)
  const body = JSON.stringify({
    date: date,
  })

  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setUrlAPI(url)
    .setBody(body)
    .setMethod('POST')

  await new ApiMutationService($f7).download(
    routeDTO,
    `prestations_${date}.pdf`,
  )
}

export {
  getWorkEventDayByUser,
  createWorkEventDay,
  updateWorkEventDay,
  deleteWorkEventDay,
  downloadCalendarEvents,
}
