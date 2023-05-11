import jwt_decode from 'jwt-decode'

    async function getCacheWorkByUser(url) {
        const cache = await caches.open('v1');
        const cachedResponse = await cache.match(url);

        return Boolean(cachedResponse);
    }
  

    function stockRespondeInCache(url, responseToCache) {
        // Stockage de la réponse en cache
        caches.open('v1').then(function (cache) {
            cache.put(url, responseToCache);
        });
    }


    function getToken() {
        return localStorage.getItem('token')
    }


    function getDecodedToken() {
        return jwt_decode(getToken())
    }

    function getUrlWorkByUser() {
        const tokenDecoded = getDecodedToken()

        return new URL('/api/worksByUser/' + tokenDecoded.id, API_URL)
    }


    export async function getWorkByUser() {
        let worksByUser = []
        const url = getUrlWorkByUser()

        const cache = await getCacheWorkByUser(url)
        if (cache) {
            return checkDataToGetOfWorkByUser(worksByUser)
        }

        return callApi(worksByUser)
    }

    async function callApi(workByUser) 
    {
        const url = getUrlWorkByUser()
        const token = getToken()

        await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then(response =>
            response
            .clone() // Cloner la réponse pour stockRespondeInCache
            .json()
            .then(function (data) {
                if (process.env.NODE_ENV === 'production') {
                    stockRespondeInCache(url, response.clone()); // Utiliser la réponse clonée
                }

                for (const iterator of data["hydra:member"]) {
                    workByUser.push(iterator);
                }

                return workByUser
            })
        )
        .catch(error => {
            console.log(error)
        })

        return workByUser
    }

    async function checkDataToGetOfWorkByUser(worksByUser) {
        const url = getUrlWorkByUser()

        const cache = await caches.open('v1');
        const cachedResponse = await cache.match(url);
        if (cachedResponse) {
            // Utilisation de la réponse en cache
            const cachedData = await cachedResponse.json()
            for (const iterator of cachedData['hydra:member']) {
                worksByUser.push(iterator)
            }
        }

        return worksByUser
    }
