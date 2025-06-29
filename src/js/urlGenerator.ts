const URL_USER: string = '/api/user/'

type URLParameters = Record<string, string | number | (string | number)[]>

function getUrl(url: string): URL {
  // @ts-ignore
  return new URL(url, API_URL)
}

function getUrlById(url: string | URL, id: string | number): URL {
  const fullUrl = typeof url === 'string' ? url : url.toString()
  // @ts-ignore
  return new URL(fullUrl + id, API_URL)
}

function getUrlUser(): URL {
  // @ts-ignore
  return new URL(URL_USER, API_URL)
}

/**
 * @param { String } url
 * @param { Object } parameters
 * @returns { URL }
 */
function getUrlWithParameters(url: string, parameters: URLParameters): URL {
  let route = `${url}?`

  const searchParams = new URLSearchParams()
  for (const key of Object.keys(parameters)) {
    if (Array.isArray(parameters[key])) {
      for (const value of parameters[key]) {
        searchParams.append(`${key}[]`, value.toString())
      }
    } else {
      searchParams.set(key, parameters[key].toString())
    }
  }

  route = route + searchParams.toString()

  // @ts-ignore
  return new URL(route, API_URL)
}

export { getUrl, getUrlById, getUrlUser, getUrlWithParameters }
