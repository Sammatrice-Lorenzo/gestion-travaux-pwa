import { getToken } from './token'
import { getUrlByUser, getUrlUser, getUrl, getUrlById} from './urlGenerator'
import { clearCache, checkDataToGetOfAResponseCached, responseIsCached, stockResponseInCache } from './cache'

const SUCCESS_INSERTION_FORM = 'L\'insertion a été bien prise en compte!'
const SUCCESS_DELETE_FORM = 'La suppression a été bien prise en compte!'
const ERROR_SERVER = 'La requête n\'as pa pu aboutir'
const URL_WORK = '/api/works/'
const URL_WORK_BY_USER = '/api/worksByUser/'

export async function getWorkByUser() {
    let worksByUser = []
    const url = getUrlByUser(URL_WORK_BY_USER)

    const cache = await responseIsCached(url)
    if (cache) {
        return checkDataToGetOfAResponseCached(url)
    }

    return callApi(worksByUser)
}

async function callApi(workByUser) {
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
                    name: data.name,
                    city: data.city,
                    start: data.start,
                    end: data.end,
                    progression: data.progression,
                    equipements: data.equipements,
                    user: data.user,
                    client: data.client
                }

                return work
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(ERROR_SERVER)
        })

    return work
}

export function createWork(form, equipements, $f7)
{
    const url = getUrl(URL_WORK)
    const urlAPiUser = getUrlUser()

    if (!customValidation(form, equipements, $f7)) {
        return
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: form.name,
            city: form.city,
            start: form.start,
            end: form.end,
            progression: form.progression,
            equipements: equipements,
            user: urlAPiUser,
            client: form.client
        })
    }).then(response =>
        response
            .json()
            .then(function (data) {
                clearCache()
                $f7.dialog.alert(SUCCESS_INSERTION_FORM)
                $f7.views.main.router.navigate('/prestation/')
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(ERROR_SERVER)
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
            $f7.dialog.alert(SUCCESS_DELETE_FORM)
            $f7.views.main.router.navigate('/prestation/')
        } else {
            $f7.dialog.alert(ERROR_SERVER)
        }
    })
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(ERROR_SERVER)
        })
}

function apiPost(url, method, body, $f7)
{
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: body
    }).then(response =>
        response
            .json()
            .then(function (data) {
                clearCache()
                $f7.dialog.alert(SUCCESS_INSERTION_FORM)
                $f7.views.main.router.navigate('/prestation/')
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(ERROR_SERVER)
        })
}

export function updateWork(form, equipements, idWork, $f7)
{
    const url = getUrlById(URL_WORK, idWork)
    const urlAPiUser = getUrlUser()

    const body = JSON.stringify({
        name: form.name,
        city: form.city,
        start: form.start,
        end: form.end,
        progression: form.progression,
        equipements: equipements,
        user: urlAPiUser,
        client: form.client
    })

    if (!customValidation(form, equipements, $f7)) {
        return
    }

    apiPost(url, 'PUT', body, $f7)
}

function customValidation(form, equipements, $f7)
{
    let valueReturned = true

    if (form.name === '') {
        $f7.dialog.alert('Veillez saisir un nom')
        valueReturned = false
    } else if (form.city === '') {
        $f7.dialog.alert('Veillez saisir le nom de la ville')
        valueReturned = false
    }

    for (const equipement of equipements) {
        if (equipement === '') {
            $f7.dialog.alert('Veillez saisir un équipement')
            valueReturned = false
        }
    }

    return valueReturned
}