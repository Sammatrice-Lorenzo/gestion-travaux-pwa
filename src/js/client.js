import { apiRequest, callAPI, deleteAPI, fetchCreate } from './api'
import { checkDataToGetOfAResponseCached, responseIsCached } from './cache'
import { RouteDTO } from './dto/RouteDTO'
import { getUrl, getUrlById } from './urlGenerator'

const URL_CLIENTS = '/api/clients/'
const URL_TO_REDIRECT = '/clients/'

async function getClientsByUser($f7) {
  const urlWorkEventDay = URL_CLIENTS.slice(0, -1)
  const url = getUrl(urlWorkEventDay)

  const cache = await responseIsCached(url)
  if (cache) {
    return checkDataToGetOfAResponseCached(url)
  }

  return callAPI(url, $f7)
}

function createClient(form, $f7) {
  if (!customValidation(form, $f7)) {
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

  if (!customValidation(form, $f7)) {
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

  const response = await callAPI(url, $f7)

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
  })
}

function customValidation(form, $f7) {
  const regexPostalCode = /^\d{5}$/
  const regexPhoneNumber = /^(0|\+33|0033)[1-9](\d{2}){4}$/

  const fields = [
    { field: form.firstname, message: 'Veuillez saisir un prénom' },
    { field: form.lastname, message: 'Veuillez saisir un nom' },
    { field: form.streetAddress, message: 'Veuillez saisir le nom de la rue' },
    { field: form.city, message: 'Veuillez saisir le nom de la ville' },
    { field: form.postalCode, message: 'Veuillez saisir le code postal' },
    {
      field: form.phoneNumber,
      message: 'Veuillez saisir le numéro de téléphone',
    },
  ]

  for (const field of fields) {
    if (field.field === '') {
      $f7.dialog.alert(field.message)
      return false
    }
  }

  if (!regexPostalCode.test(form.postalCode)) {
    $f7.dialog.alert('Veuillez saisir un code postal valide')
    return false
  }

  if (!regexPhoneNumber.test(form.phoneNumber)) {
    $f7.dialog.alert('Veuillez saisir un numéro de téléphone valide')
    return false
  }

  return true
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
