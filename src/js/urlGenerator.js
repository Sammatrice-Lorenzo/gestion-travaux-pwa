const URL_USER = '/api/user/'

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
 * @returns { URL }
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
    return new URL(URL_USER, API_URL)
}

/**
 * @param { String } url 
 * @param { Object } parameters
 * @returns { URL }
 */
function getUrlWithParameters(url, parameters) {
    let route = `${url}?`

    const searchParams = new URLSearchParams()
    for (const key of Object.keys(parameters)) {
        if (Array.isArray(parameters[key])) {
            for (const value of parameters[key]) {
                searchParams.append(`${key}[]`, value);
            }
        } else {
            searchParams.set(key, parameters[key]);
        }
    }

    route = route + searchParams.toString()

    return new URL(route, API_URL)
}

export {
    getUrl,
    getUrlById,
    getUrlUser,
    getUrlWithParameters
}