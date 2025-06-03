import { apiRequest, deleteAPI, fetchCreate } from '../api'
import { checkDataToGetOfAResponseCached, responseIsCached } from '../cache'
import { RouteDTO } from '../dto/RouteDTO'
import { ApiService } from '../service/api/ApiService'
import { clientSchema } from '../service/client/clientSchema'
import { handleSubmitForm } from '../service/form/formErrorInputs'
import { getUrl, getUrlById } from '../urlGenerator'

const URL_CLIENTS = '/api/clients/'
const URL_TO_REDIRECT = '/clients/'
const ID_FORM = 'form-client'

async function getClientsByUser($f7) {
  const urlWorkEventDay = URL_CLIENTS.slice(0, -1)
  const url = getUrl(urlWorkEventDay)

  const hasCache = await responseIsCached(url)
  if (hasCache) {
    return checkDataToGetOfAResponseCached(url)
  }

  return new ApiService($f7).call(url)
}

function createClient(form, $f7) {
  if (!handleSubmitForm(form, clientSchema, ID_FORM)) {
    return
  }

  const url = getUrl(URL_CLIENTS.slice(0, -1))
  const body = getBodyClient(form)

  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setRoute(URL_TO_REDIRECT)
    .setUrlAPI(url)
    .setBody(body)

  fetchCreate(routeDTO)
}

function updateClient(form, idClient, $f7) {
  const url = getUrlById(URL_CLIENTS, idClient)
  const body = getBodyClient(form)

  if (!handleSubmitForm(form, clientSchema, ID_FORM)) {
    return
  }

  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setRoute(URL_TO_REDIRECT)
    .setUrlAPI(url)
    .setBody(body)
    .setMethod('PUT')

  apiRequest(routeDTO)
}

function deleteClient(idClient, $f7) {
  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setIdElement(idClient)
    .setRoute(URL_TO_REDIRECT)
    .setUrlAPI(URL_CLIENTS)

  deleteAPI(routeDTO)
}

async function findClientById(id, $f7) {
  const url = getUrlById(URL_CLIENTS, id)

  const apiService = new ApiService($f7)
  const response = await apiService.call(url)

  return response[0]
}

function getBodyClient(form) {
  return JSON.stringify({
    firstname: form.firstname,
    lastname: form.lastname,
    city: form.city,
    phoneNumber: getPhoneNumberInString(form.phoneNumber),
    postalCode: form.postalCode,
    streetAddress: form.streetAddress,
    email: form.email,
  })
}

/**
 * En format 06.01.02.03.04
 * @param { String } phoneNumber
 * @returns { String }
 */
function getPhoneNumberInString(phoneNumber) {
  return phoneNumber.length <= 10
    ? phoneNumber.match(/.{1,2}/g).join('.')
    : phoneNumber
}

export {
  getClientsByUser,
  createClient,
  updateClient,
  deleteClient,
  findClientById,
  getPhoneNumberInString,
  URL_CLIENTS,
}
