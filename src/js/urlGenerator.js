import { getDecodedToken } from './token'

const URL_USER = '/api/user/'

/**
 * @param { String } url 
 * @returns { URL }
 */
function getUrlByUser(url) {
    const tokenDecoded = getDecodedToken()

    return new URL(url + tokenDecoded.id, API_URL)
}

/**
 * @param { String } url 
 * @returns { URL }
 */
function getUrl(url)
{
    return new URL(url, API_URL)
}

/**
 * @param { String } url 
 * @param { String | Number } id 
 * @returns {URL}
 */
function getUrlById(url, id)
{
    return new URL(url + id, API_URL)
}

/**
 * @returns { URL }
 */
function getUrlUser()
{
    return getUrlByUser(URL_USER)
}

/**
 * @param { String } url 
 * @param { Object } parameters
 * @returns { URL }
 */
function getUrlWithParameters(url, parameters) {
    let route = url + '?'

    Object.keys(parameters).forEach((key) => {
        if (Array.isArray(parameters[key])) {
            parameters[key].forEach((value) => {
                route += key + `[]=${value}&`
            })
        } else {
            route += key + `=${parameters[key]}&`
        }
    })

    route = route.slice(0, -1)

    return new URL(route, API_URL)
}

export {
    getUrlByUser,
    getUrl,
    getUrlById,
    getUrlUser,
    getUrlWithParameters
}