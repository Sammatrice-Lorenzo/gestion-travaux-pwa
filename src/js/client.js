import { getToken, getDecodedToken } from './token'
import { stockResponseInCache, responseIsCached, checkDataToGetOfAResponseCached, clearCache } from './cache'
import { getUrlByUser, getUrlUser, getUrl, getUrlById } from './urlGenerator' 

const URL_CLIENTS_BY_USER = '/api/clientsByUser/' 
const SUCCESS_INSERTION_FORM = 'L\'insertion a été bien prise en compte!'
const SUCCESS_DELETE_FORM = 'La suppression a été bien prise en compte!'
const ERROR_SERVER = 'La requête n\'as pa pu aboutir'
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
                clearCache()
                $f7.dialog.alert(SUCCESS_INSERTION_FORM)
                $f7.views.main.router.navigate('/clients/')
            })
    )
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
                $f7.views.main.router.navigate('/clients/')
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(ERROR_SERVER)
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

    apiPost(url, 'PUT', body, $f7)
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
            $f7.dialog.alert(SUCCESS_DELETE_FORM)
            $f7.views.main.router.navigate('/clients/')
        } else {
            $f7.dialog.alert(ERROR_SERVER)
        }
    })
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(ERROR_SERVER)
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
            $f7.dialog.alert(ERROR_SERVER)
        })

    return client
}

function customValidation(form, $f7)
{
    let valueReturned = true
    const regexCodePostal = /^\d{5}$/
    const regexNumeroTelephone = /^(0|\+33|0033)[1-9](\d{2}){4}$/

    if (form.firstname === '') {
        $f7.dialog.alert('Veillez saisir un prénom')
        valueReturned = false
    } else if (form.lastname === '') {
        $f7.dialog.alert('Veillez saisir un nom')
        valueReturned = false
    } else if (form.city === '') {
        $f7.dialog.alert('Veillez saisir le nom de la ville')
        valueReturned = false
    } else if (form.streetAddress === '') {
        $f7.dialog.alert('Veillez saisir le nom de la rue')
        valueReturned = false
    } else if (form.postalCode === '') {
        $f7.dialog.alert('Veillez saisir le code postal ')
        valueReturned = false
    } else if (!regexCodePostal.test(form.postalCode)) {
        $f7.dialog.alert('Veillez saisir un code postal valide')
        valueReturned = false
    } else if (form.phoneNumber === '') {
        $f7.dialog.alert('Veillez saisir le numéro de téléphone ')
        valueReturned = false
    } else if (!regexNumeroTelephone.test(form.phoneNumber)) {
        $f7.dialog.alert('Veillez saisir un numéro de téléphone valide ')
        valueReturned = false
    }

    return valueReturned
}
