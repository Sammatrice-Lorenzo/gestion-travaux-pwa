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
function apiRequest(routeDTO)
{
    const $f7 = routeDTO.getApp()
    const method = routeDTO.getMethod()
    const message = messages.getTypeMessageByMethodAPI(method)

    fetch(routeDTO.getUrlAPI(), {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: routeDTO.getBody()
    }).then(response =>
        response
            .json()
            .then(function () {
                const statusCode = response.status
                if (statusCode === 200 || statusCode === 201) {
                    clearCache()
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

/**
 * @param { RouteDTO } routeDTO 
 */
function createAPI(routeDTO) {
    const $f7 = routeDTO.getApp()

    fetch(routeDTO.getUrlAPI(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: routeDTO.getBody()
    }).then(response =>
        response
            .json()
            .then(function (data) {
                if (response.status === 422) {
                    $f7.dialog.alert(data['hydra:description'])
                } else {
                    clearCache()
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
function deleteAPI(routeDTO) {
    const url = getUrlById(routeDTO.getUrlAPI(), routeDTO.getIdElement())
    const $f7 = routeDTO.getApp()

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(function (response) {
        clearCache()
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
    const url = getUrl(routeDTO.getUrlAPI())
    const token = getToken()

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: routeDTO.getBody()
    }).then(response =>
        response
            .blob()
            .then(function (data) {
                const blobUrl = window.URL.createObjectURL(data)
        
                const link = document.createElement('a')
                link.href = blobUrl
                link.download = nameFile
        
                link.style.display = 'none'
                link.click()
                clearCache()
            })
    )
        .catch(error => {
            console.log(error)
            clearCache()
            $f7.dialog.alert(messages.ERROR_SERVER)
        })
}

/**
 * @param { String } urlByUser 
 * @param { any } $f7 
 * @returns { Promise<any> }
 */
async function callAPI(urlByUser, $f7) {
    let responses = []
    const url = getUrlByUser(urlByUser)
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
                    responses.push(iterator)
                }

                return responses
            })
    )
        .catch(error => {
            console.log(error)
        })

    return responses
}

export { apiRequest, deleteAPI, fetchFileAPI, callAPI, createAPI }
