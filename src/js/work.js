import { apiRequest, callAPI, deleteAPI, fetchCreate } from './api'
import { checkDataToGetOfAResponseCached, responseIsCached } from './cache'
import { RouteDTO } from './dto/RouteDTO'
import { getUrl, getUrlById, getUrlUser } from './urlGenerator'

const URL_WORK = '/api/works/'
const URL_TO_REDIRECT = '/prestation/'

async function getWorkByUser($f7) {
  const url = getUrl(URL_WORK)

  const cache = await responseIsCached(url)
  if (cache) {
    return checkDataToGetOfAResponseCached(url)
  }

  return callAPI(url, $f7)
}

async function findWorkById(id, $f7) {
  const url = getUrlById(URL_WORK, id)
  const response = await callAPI(url, $f7)

  return response[0]
}

function createWork(form, $f7) {
  if (!customValidation(form, $f7)) {
    return
  }

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

function customValidation(form, $f7) {
  let valueReturned = true

  if (form.name === '') {
    $f7.dialog.alert('Veuillez saisir un nom')
    valueReturned = false
  } else if (form.city === '') {
    $f7.dialog.alert('Veuillez saisir le nom de la ville')
    valueReturned = false
  }

  if (!form.client) {
    $f7.dialog.alert(
      'Veuillez rajouter des clients pour pouvoir créer des prestations',
    )
    valueReturned = false
  }

  for (const equipement of form.equipements) {
    if (equipement === '') {
      $f7.dialog.alert('Veuillez saisir un équipement')
      valueReturned = false
    }
  }

  return valueReturned
}

/**
 * @param { Array } equipements
 * @returns { String }
 */
function getEquipementsInLine(equipements) {
  return equipements.join(', ')
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
    start: form.start,
    end: form.end,
    progression: form.progression,
    equipements: form.equipements,
    user: urlAPiUser,
    client: `/api/clients/${form.client}`,
    totalAmount: Number.parseFloat(form.totalAmount),
  })
}

export {
  getWorkByUser,
  findWorkById,
  createWork,
  updateWork,
  deleteWork,
  getEquipementsInLine,
}
