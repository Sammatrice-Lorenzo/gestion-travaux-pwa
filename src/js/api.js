import { clearCache, stockResponseInCache } from './cache'
import { RouteDTO } from './dto/RouteDTO'
import { getUrlById, getUrl, getUrlByUser } from './urlGenerator'
import * as messages from './messages'
import { getToken } from './token'

/**
 * @param { RouteDTO } routeDTO 
 * 
 * @returns { void } 
 */
function apiRequest(routeDTO, hasAuthentification = false)
{
    const token = getToken()

    const $f7 = routeDTO.getApp()
    const method = routeDTO.getMethod()
    const message = messages.getTypeMessageByMethodAPI(method)

    let headers = {
        'Content-Type': 'application/json',
    }

    if (hasAuthentification) {
        headers = {
            'Authorization': `Bearer ${token}`,
        }
    }

    fetch(routeDTO.getUrlAPI(), {
        method: method,
        headers: headers,
        body: routeDTO.getBody()
    }).then(response =>
        response
            .json()
            .then(async function () {
                const statusCode = response.status
                if (statusCode === 200 || statusCode === 201) {
                    await clearCache()
                    $f7.dialog.alert(message)
                    $f7.views.main.router.navigate(routeDTO.getRoute())
                } else {
                    $f7.dialog.alert(messages.ERROR_SERVER)
                }
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(messages.ERROR_SERVER)
        })
}

function sendFilesAPI(routeDTO) {
    const token = getToken()
    let headers = {
        'Authorization': `Bearer ${token}`,
    }

    fetchCreate(routeDTO, headers)
}

/**
 * @param { RouteDTO } routeDTO 
 */
function createAPI(routeDTO) {
    let headers = {
        'Content-Type': 'application/json',
    }

    fetchCreate(routeDTO, headers)
}

/**
 * @param { RouteDTO } routeDTO 
 */
function fetchCreate(routeDTO, headers) {
    const $f7 = routeDTO.getApp()

    fetch(routeDTO.getUrlAPI(), {
        method: 'POST',
        headers: headers,
        body: routeDTO.getBody()
    }).then(response =>
        response
            .json()
            .then(async function (data) {
                if (response.status === 422) {
                    $f7.dialog.alert(data['hydra:description'])
                } else {
                    await clearCache()
                    $f7.dialog.alert(messages.SUCCESS_INSERTION_FORM)
                    $f7.views.main.router.navigate(routeDTO.getRoute())
                }
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(messages.ERROR_SERVER)
        })
}

/**
 * @param { RouteDTO } routeDTO 
 */
function deleteAPI(routeDTO, hasAuthentification = false) {
    const url = getUrlById(routeDTO.getUrlAPI(), routeDTO.getIdElement())
    const $f7 = routeDTO.getApp()
    const token = getToken()

    let headers = {
        'Content-Type': 'application/json',
    }

    if (hasAuthentification) {
        headers = {
            'Authorization': `Bearer ${token}`,
        }
    }

    fetch(url, {
        method: 'DELETE',
        headers: headers,
    }).then(async function (response) {
        await clearCache()
        if (response.status === 204) {
            $f7.dialog.alert(messages.SUCCESS_DELETE_FORM)
            $f7.views.main.router.navigate(routeDTO.getRoute())
        } else {
            $f7.dialog.alert(messages.ERROR_SERVER)
        }
    })
        .catch(error => {
            $f7.dialog.alert(messages.ERROR_SERVER)
        })
}

/**
 * @param { RouteDTO } routeDTO 
 * @param { String } nameFile 
 */
function fetchFileAPI(routeDTO, nameFile) {
    const $f7 = routeDTO.getApp()
    const token = getToken()

    fetch(routeDTO.getUrlAPI(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: routeDTO.getBody()
    }).then(response =>
        response
            .blob()
            .then(async function (data) {
                const blobUrl = window.URL.createObjectURL(data)
        
                const link = document.createElement('a')
                link.href = blobUrl
                link.download = nameFile
        
                link.style.display = 'none'
                link.click()
                await clearCache()
            })
    )
        .catch(async function (error) {
            console.log(error)
            await clearCache()
            $f7.dialog.alert(messages.ERROR_SERVER)
        })
}

/**
 * @param { URL } url 
 * @param { any } $f7 
 * @returns { Promise<any> }
 */
async function callAPI(url, $f7) {
    let responses = []
    const token = getToken()
    const preloader = $f7.preloader
    preloader.show()
    
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
            .then(async function (data) {
                if (process.env.NODE_ENV === 'production') {
                    stockResponseInCache(url, response.clone()) // Utiliser la réponse clonée
                }
                
                if (data.code === 401) {
                    $f7.dialog.alert(messages.TOKEN_EXPIRED)
                    $f7.views.main.router.navigate('/')
                }

                const dataResponse = data.hasOwnProperty('hydra:member') ? data["hydra:member"] : data
                for (const iterator of dataResponse) {
                    responses.push(iterator)
                }

                preloader.hide()

                return responses
            })
    )
        .catch(error => {
            console.log(error)
            preloader.hide()
        })

    return responses
}

export { apiRequest, deleteAPI, fetchFileAPI, callAPI, createAPI, sendFilesAPI }
