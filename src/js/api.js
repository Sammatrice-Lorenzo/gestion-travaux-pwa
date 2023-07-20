import { clearCache } from './cache'
import * as messages from './messages'

/**
 * @param { URL } url 
 * @param { string } method 
 * @param { Array } params 
 * @param {*} $f7 
 * 
 * @returns { void } 
 */
export function apiRequest(url, method, params, $f7)
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
                clearCache()
                $f7.dialog.alert(message)
                $f7.views.main.router.navigate(route)
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(messages.ERROR_SERVER)
        })
}