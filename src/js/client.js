import { getToken } from './token'
import { stockResponseInCache, responseIsCached, checkDataToGetOfAResponseCached, clearCache } from './cache'
import { getUrlByUser, getUrlUser, getUrl, getUrlById } from './urlGenerator'
import * as messages from './messages'
import { apiRequest } from './api'

const URL_CLIENTS_BY_USER = '/api/clientsByUser/' 
const URL_CLIENTS = '/api/clients/'

export async function getClientsByUser() {
    let clientsByUser = []
    const url = getUrlByUser(URL_CLIENTS_BY_USER)

    const cache = await responseIsCached(url)
    if (cache) {
        return checkDataToGetOfAResponseCached(url)
    }

    return callApi(clientsByUser)
}

async function callApi(clientsByUser) {
    const url = getUrlByUser(URL_CLIENTS_BY_USER)
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
                    clientsByUser.push(iterator)
                }

                return clientsByUser
            })
    )
        .catch(error => {
            console.log(error)
        })

    return clientsByUser
}

export function createClient(form, $f7)
{
    const url = getUrl('/api/clients')
    const urlAPiUser = getUrlUser()

    if (!customValidation(form, $f7)) {
        return
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            firstname: form.firstname,
            lastname: form.lastname,
            city: form.city,
            phoneNumber: form.phoneNumber,
            postalCode: form.postalCode,
            streetAddress: form.streetAddress,
            user: urlAPiUser,
        })
    }).then(response =>
        response
            .json()
            .then(function (data) {
                if (response.status === 422) {
                    $f7.dialog.alert(data['hydra:description'])
                } else {
                    clearCache()
                    $f7.dialog.alert(messages.SUCCESS_INSERTION_FORM)
                    $f7.views.main.router.navigate('/clients/')
                }
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(messages.ERROR_SERVER)
        })
}

export function updateClient(form, idClient, $f7)
{
    const url = getUrlById(URL_CLIENTS, idClient)
    const urlAPiUser = getUrlUser()

    const body = JSON.stringify({
        firstname: form.firstname,
        lastname: form.lastname,
        city: form.city,
        phoneNumber: form.phoneNumber,
        postalCode: form.postalCode,
        streetAddress: form.streetAddress,
        user: urlAPiUser,
    })

    if (!customValidation(form, $f7)) {
        return
    }

    apiRequest(url, 'PUT', [body, '/clients/'], $f7)
}

export function deleteClient(idClient, $f7)
{
    const url = getUrlById(URL_CLIENTS, idClient)

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
            $f7.views.main.router.navigate('/clients/')
        } else {
            $f7.dialog.alert(messages.ERROR_SERVER)
        }
    })
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(messages.ERROR_SERVER)
        })
}

export async function findClientById(id, $f7){
    const url = getUrlById(URL_CLIENTS, id)
    let client = {}

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
                client = {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    city: data.city,
                    phoneNumber: data.phoneNumber,
                    postalCode: data.postalCode,
                    streetAddress: data.streetAddress,
                    user: data.user,
                }

                return client
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(messages.ERROR_SERVER)
        })

    return client
}

function customValidation(form, $f7) {
    const regexCodePostal = /^\d{5}$/
    const regexNumeroTelephone = /^(0|\+33|0033)[1-9](\d{2}){4}$/

    const fields = [
        { field: form.firstname, message: 'Veuillez saisir un prénom' },
        { field: form.lastname, message: 'Veuillez saisir un nom' },
        { field: form.streetAddress, message: 'Veuillez saisir le nom de la rue' },
        { field: form.city, message: 'Veuillez saisir le nom de la ville' },
        { field: form.postalCode, message: 'Veuillez saisir le code postal' },
        { field: form.phoneNumber, message: 'Veuillez saisir le numéro de téléphone' },
    ]
  
    for (const field of fields) {
        if (field.field === '') {
            $f7.dialog.alert(field.message)
            return false
        }
    }
  
    if (!regexCodePostal.test(form.postalCode)) {
        $f7.dialog.alert('Veuillez saisir un code postal valide')
        return false
    }
  
    if (!regexNumeroTelephone.test(form.phoneNumber)) {
        $f7.dialog.alert('Veuillez saisir un numéro de téléphone valide')
        return false
    }
  
    return true
}
  