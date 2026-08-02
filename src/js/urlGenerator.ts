const URL_USER: string = '/api/user/'

type URLParameters = Record<string, string | number | (string | number)[]>

function getBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  // @ts-ignore
  return API_URL as string
}

function getUrl(url: string): URL {
  return new URL(url, getBaseUrl())
}

function getUrlById(url: string | URL, id: string | number): URL {
  const fullUrl = typeof url === 'string' ? url : url.toString()
  return new URL(fullUrl + id, getBaseUrl())
}

function getUrlUser(): URL {
  return new URL(URL_USER, getBaseUrl())
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

  return new URL(route, getBaseUrl())
}

export { getUrl, getUrlById, getUrlUser, getUrlWithParameters }
