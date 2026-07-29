import type Framework7 from 'framework7'
import type { Calendar } from 'framework7/components/calendar'
import type EventsInterface from '../intefaces/WorkEventDay/EventInterface'
import type WorkEventDayInterface from '../intefaces/WorkEventDay/WorkEventDayInterface'
import type WorkEventDaySearchCriteriaInterface from '../intefaces/WorkEventDay/WorkEventDaySearchCriteriaInterface'
import type WorkEventDaySearchResultInterface from '../intefaces/WorkEventDay/WorkEventDaySearchResultInterface'
import { checkDataToGetOfAResponseCached, responseIsCached } from './cache'
import { RouteDTO } from './dto/RouteDTO.js'
import { ApiMutationService } from './service/api/ApiMutationService.ts'
import { ApiService } from './service/api/ApiService.ts'
import { getDateCalendarDefaultFormat } from './service/calendar/calendarDateService.ts'
import { getUrl, getUrlById, getUrlWithParameters } from './urlGenerator'

const URL_WORK_EVENT_DAY = '/api/work_event_days/'
const URL_TO_REDIRECT = '/calendar/'

async function getWorkEventDayByUser(
  $f7: Framework7,
  calendar: Calendar.Calendar | null = null,
): Promise<WorkEventDayInterface[]> {
  const date = calendar
    ? getDateCalendarDefaultFormat(calendar)
    : new Date().toISOString().slice(0, 10)
  const urlWorkEventDay = URL_WORK_EVENT_DAY.slice(0, -1)
  const url = getUrlWithParameters(urlWorkEventDay, { date })

  const cache = await responseIsCached(url)
  if (cache) {
    return checkDataToGetOfAResponseCached<WorkEventDayInterface[]>(url)
  }

  return new ApiService($f7).call<WorkEventDayInterface>(url)
}

const handleCallAPI = async (
  url: URL,
  method: string,
  $f7: Framework7,
  form: EventsInterface,
) => {
  const body = getBody(form)

  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setRoute(URL_TO_REDIRECT)
    .setUrlAPI(url)
    .setBody(body)
    .setMethod(method)
    .setSkipNavigation(true)

  return new ApiMutationService($f7).generic(routeDTO)
}

async function createWorkEventDay(form: EventsInterface, $f7: Framework7) {
  const urlWorkEventDay = URL_WORK_EVENT_DAY.slice(0, -1)
  const url = getUrl(urlWorkEventDay)

  return handleCallAPI(url, 'POST', $f7, form)
}

async function updateWorkEventDay(
  form: EventsInterface,
  idWorkEventDay: number,
  $f7: Framework7,
): Promise<void> {
  const url = getUrlById(URL_WORK_EVENT_DAY, idWorkEventDay)

  await handleCallAPI(url, 'PUT', $f7, form)
}

async function deleteWorkEventDay(
  idWorkEventDay: number,
  $f7: Framework7,
): Promise<void> {
  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setIdElement(idWorkEventDay)
    .setRoute(URL_TO_REDIRECT)
    .setUrlAPI(URL_WORK_EVENT_DAY)
    .setSkipNavigation(true)

  await new ApiMutationService($f7).delete(routeDTO)
}

/**
 * On ajoute plus deux aux date pour le format américain
 */
const getBody = (body: EventsInterface): string => {
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

async function downloadCalendarEvents(
  calendar: Calendar.Calendar,
  $f7: Framework7,
): Promise<void> {
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

async function searchWorkEventDays(
  criteria: WorkEventDaySearchCriteriaInterface,
  $f7: Framework7,
): Promise<WorkEventDaySearchResultInterface[]> {
  const url = getUrl(`${URL_WORK_EVENT_DAY}search`)
  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setUrlAPI(url)
    .setBody(JSON.stringify(criteria))
    .setMethod('POST')

  const apiMutationService = new ApiMutationService($f7)

  return apiMutationService.fetchJson<WorkEventDaySearchResultInterface>(
    routeDTO,
  )
}

async function downloadWorkEventDaySearchExport(
  criteria: WorkEventDaySearchCriteriaInterface,
  format: string,
  $f7: Framework7,
): Promise<void> {
  const url = getUrl(`${URL_WORK_EVENT_DAY}search/export`)
  const body = JSON.stringify({ ...criteria, format })

  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setUrlAPI(url)
    .setBody(body)
    .setMethod('POST')

  await new ApiMutationService($f7).download(
    routeDTO,
    `prestations_recherche.${format}`,
  )
}

export {
  getWorkEventDayByUser,
  createWorkEventDay,
  updateWorkEventDay,
  deleteWorkEventDay,
  downloadCalendarEvents,
  searchWorkEventDays,
  downloadWorkEventDaySearchExport,
}
