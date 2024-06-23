import { clearCache } from './cache'
import { RouteDTO } from './dto/RouteDTO'
import { getUrlById, getUrl } from './urlGenerator'
import * as messages from './messages'
import { getToken } from './token'

/**
 * @param { URL } url 
 * @param { string } method 
 * @param { Array } params 
 * @param {*} $f7 
 * 
 * @returns { void } 
 */
function apiRequest(url, method, params, $f7)
{
    const message = messages.getTypeMessageByMethodAPI(method)
    const [body, route] = params

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
                const statusCode = response.status
                if (statusCode === 200 || statusCode === 201) {
                    clearCache()
                    $f7.dialog.alert(message)
                    $f7.views.main.router.navigate(route)
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

export { apiRequest, deleteAPI, fetchFileAPI }
