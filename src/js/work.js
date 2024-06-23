import { apiRequest } from './api'
import { getToken } from './token'
import * as messages from './messages'
import { getUrlByUser, getUrlUser, getUrl, getUrlById} from './urlGenerator'
import { clearCache, checkDataToGetOfAResponseCached, responseIsCached, stockResponseInCache } from './cache'

const URL_WORK = '/api/works/'
const URL_WORK_BY_USER = '/api/worksByUser/'

export async function getWorkByUser($f7) {
    let worksByUser = []
    const url = getUrlByUser(URL_WORK_BY_USER)

    const cache = await responseIsCached(url)
    if (cache) {
        return checkDataToGetOfAResponseCached(url)
    }

    return callApi(worksByUser, $f7)
}

async function callApi(workByUser, $f7) {
    const url = getUrlByUser(URL_WORK_BY_USER)
    const token = getToken()

    await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response =>
        response
            .clone() // Cloner la réponse pour stockResponseInCache
            .json()
            .then(function (data) {
                if (process.env.NODE_ENV === 'production') {
                    stockResponseInCache(url, response.clone()) // Utiliser la réponse clonée
                }

                if (data.code === 401) {
                    $f7.dialog.alert(messages.TOKEN_EXPIRED)
                    $f7.views.main.router.navigate('/')
                }

                for (const iterator of data["hydra:member"]) {
                    workByUser.push(iterator)
                }

                return workByUser
            })
    )
        .catch(error => {
            console.log(error)
        })

    return workByUser
}

export async function findWorkById(id, $f7)
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
                    invoice: data.invoice
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

export function createWork(form, $f7)
{
    const url = getUrl('/api/works')
    const body = getBodyWork(form)
    if (!customValidation(form, $f7)) {
        return
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: body
    }).then(response =>
        response
            .json()
            .then(function (data) {
                if (data.code === '400') {
                    $f7.dialog.alert(messages.ERROR_SERVER)
                } else {
                    clearCache()
                    $f7.dialog.alert(messages.SUCCESS_INSERTION_FORM)
                    $f7.views.main.router.navigate('/prestation/')
                }
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(messages.ERROR_SERVER)
        })
}

export function deleteWork(idWork, $f7)
{
    const url = getUrlById(URL_WORK, idWork)

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
    }).then(function (response) {
        clearCache()
        if (response.status === 204) {
            $f7.dialog.alert(messages.SUCCESS_DELETE_FORM)
            $f7.views.main.router.navigate('/prestation/')
        } else {
            $f7.dialog.alert(messages.ERROR_SERVER)
        }
    })
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(messages.ERROR_SERVER)
        })
}

export function updateWork(form, idWork, $f7)
{
    const url = getUrlById(URL_WORK, idWork)
    const body = getBodyWork(form)

    if (!customValidation(form, $f7)) {
        return
    }

    apiRequest(url, 'PUT', [body, '/prestation/'], $f7)
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
 * @returns { string }
 */
export function getEquipementsInLine(equipements)
{
    return equipements.join(', ')
}

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
        client: form.client
    })
}