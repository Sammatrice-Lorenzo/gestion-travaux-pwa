import { getToken, getDecodedToken } from './token'
import { stockResponseInCache, responseIsCached, checkDataToGetOfAResponseCached } from './cache'

function getUrlClientsByUser() {
    const tokenDecoded = getDecodedToken()

    return new URL('/api/clientsByUser/' + tokenDecoded.id, API_URL)
}

export async function getClientsByUser() {
    let clientsByUser = []
    const url = getUrlClientsByUser()

    const cache = await responseIsCached(url)
    if (cache) {
        return checkDataToGetOfAResponseCached(url)
    }

    return callApi(clientsByUser)
}

async function callApi(clientsByUser) {
    const url = getUrlClientsByUser()
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
