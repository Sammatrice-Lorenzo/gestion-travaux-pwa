import { getDecodedToken } from './token'

const URL_USER = '/api/user/'

/**
 * @param {string} url 
 * @returns {URL}
 */
export function getUrlByUser(url) {
    const tokenDecoded = getDecodedToken()

    return new URL(url + tokenDecoded.id, API_URL)
}

/**
 * @param {string} url 
 * @returns {URL}
 */
export function getUrl(url)
{
    return new URL(url, API_URL)
}

/**
 * @param {string} url 
 * @param {string|int} id 
 * @returns {URL}
 */
export function getUrlById(url, id)
{
    return new URL(url + id, API_URL)
}

/**
 * @returns { URL }
 */
export function getUrlUser()
{
    return getUrlByUser(URL_USER)
}