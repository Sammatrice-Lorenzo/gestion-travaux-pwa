import Framework7 from 'framework7'
import { apiRequest, deleteAPI, fetchCreate } from './api'
import { checkDataToGetOfAResponseCached, responseIsCached } from './cache'
import { RouteDTO } from './dto/RouteDTO'
import { ApiService } from './service/api/ApiService'
import {
  getUrl,
  getUrlById,
  getUrlUser,
  getUrlWithParameters,
} from './urlGenerator'

const URL_WORK = '/api/works/'
const URL_TO_REDIRECT = '/prestation/'

/**
 * @param { Framework7 } $f7
 * @param { number } currentPage
 */
async function getWorkByUser($f7, currentPage) {
  const url = getUrlWithParameters(URL_WORK, { page: currentPage })
  const apiService = new ApiService($f7)

  const isCachedResponse = await responseIsCached(url)
  let works
  if (isCachedResponse) {
    const responseCached = await checkDataToGetOfAResponseCached(url)
    works = apiService.extractDataResponse(responseCached)
  } else {
    works = await apiService.call(url, 'application/ld+json')
  }

  return {
    works,
    totalItems: apiService.getTotalItems(),
  }
}

async function findWorkById(id, $f7) {
  const url = getUrlById(URL_WORK, id)
  const apiService = new ApiService($f7)
  const works = await apiService.call(url)

  return works[0]
}

function createWork(form, $f7) {
  const url = getUrl('/api/works')
  const body = getBodyWork(form)

  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setRoute(URL_TO_REDIRECT)
    .setUrlAPI(url)
    .setBody(body)

  fetchCreate(routeDTO)
}

function deleteWork(idWork, $f7) {
  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setIdElement(idWork)
    .setRoute(URL_TO_REDIRECT)
    .setUrlAPI(URL_WORK)

  deleteAPI(routeDTO)
}

function updateWork(form, idWork, $f7) {
  const url = getUrlById(URL_WORK, idWork)
  const body = getBodyWork(form)

  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setRoute(URL_TO_REDIRECT)
    .setUrlAPI(url)
    .setBody(body)
    .setMethod('PUT')

  apiRequest(routeDTO)
}

/**
 * @param { Object } form
 * @returns { String }
 */
function getBodyWork(form) {
  const urlAPiUser = getUrlUser()

  return JSON.stringify({
    name: form.name,
    city: form.city,
    start: new Date(form.start).toISOString(),
    end: new Date(form.end).toISOString(),
    progression: form.progression,
    equipements: form.equipements,
    user: urlAPiUser,
    client: `/api/clients/${form.client}`,
    totalAmount: Number.parseFloat(form.totalAmount),
  })
}

export { getWorkByUser, findWorkById, createWork, updateWork, deleteWork }
