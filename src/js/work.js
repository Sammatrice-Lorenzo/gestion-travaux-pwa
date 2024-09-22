import { RouteDTO } from './dto/RouteDTO'
import * as messages from './messages'
import { apiRequest, callAPI, createAPI, deleteAPI } from './api'
import { checkDataToGetOfAResponseCached, responseIsCached } from './cache'
import { getUrlByUser, getUrlUser, getUrl, getUrlById} from './urlGenerator'

const URL_WORK = '/api/works/'
const URL_WORK_BY_USER = '/api/worksByUser/'
const URL_TO_REDIRECT = '/prestation/'

async function getWorkByUser($f7) {
    const url = getUrlByUser(URL_WORK_BY_USER)

    const cache = await responseIsCached(url)
    if (cache) {
        return checkDataToGetOfAResponseCached(url)
    }

    return callAPI(url, $f7)
}

async function findWorkById(id, $f7)
{
    const url = getUrlById(URL_WORK, id)
    let work = {}

    await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
    }).then(response =>
        response
            .json()
            .then(function (data) {
                work = {
                    id: data.id,
                    name: data.name,
                    city: data.city,
                    start: data.start,
                    end: data.end,
                    progression: data.progression,
                    equipements: data.equipements,
                    user: data.user,
                    client: data.client,
                    invoice: data.invoice,
                    totalAmount: data.totalAmount
                }

                return work
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(messages.ERROR_SERVER)
        })

    return work
}

function createWork(form, $f7)
{
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

    createAPI(routeDTO)
}

function deleteWork(idWork, $f7)
{
    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setIdElement(idWork)
        .setRoute(URL_TO_REDIRECT)
        .setUrlAPI(URL_WORK)

    deleteAPI(routeDTO)
}

function updateWork(form, idWork, $f7)
{
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

function customValidation(form, $f7)
{
    let valueReturned = true

    if (form.name === '') {
        $f7.dialog.alert('Veuillez saisir un nom')
        valueReturned = false
    } else if (form.city === '') {
        $f7.dialog.alert('Veuillez saisir le nom de la ville')
        valueReturned = false
    }

    if (!form.client) {
        $f7.dialog.alert('Veuillez rajouter des clients pour pouvoir créer des prestations')
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
function getEquipementsInLine(equipements)
{
    return equipements.join(', ')
}

/**
 * @param { Object } form
 * @returns { String }
 */
function getBodyWork(form)
{
    const urlAPiUser = getUrlUser()

    return JSON.stringify({
        name: form.name,
        city: form.city,
        start: form.start,
        end: form.end,
        progression: form.progression,
        equipements: form.equipements,
        user: urlAPiUser,
        client: form.client,
        totalAmount: parseFloat(form.totalAmount)
    })
}

export {
    getWorkByUser,
    findWorkById,
    createWork,
    updateWork,
    deleteWork,
    getEquipementsInLine
}