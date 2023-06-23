const ERROR_SERVER = 'La requête n\'as pa pu aboutir'

export function login(username, password, $f7) {
    const url = new URL('/api/login', API_URL);

    if (!checkInputFormLogin(username, password, $f7)) return

    // Récupération de la réponse depuis le cache
    getCacheLogin(url)
        .then(function (response) {
            if (response) {
                // Utilisation de la réponse en cache
                return response.json().then(function (token) {
                    localStorage.setItem('token', token.token);
                    $f7.views.main.router.navigate('/prestation/');
                });
            }
            // Si la réponse n'est pas dans le cache, on fait une requête réseau
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
            }).then(response =>
                response.clone().json().then(function (token) {
                    if ('code' in token && token.code === 401) {
                        $f7.dialog.alert('Vos identifiants sont incorrects!')
                    } else {
                        if (process.env.NODE_ENV === 'production') {
                            cloneLoginCache(response, url)
                        }
                        localStorage.setItem('token', token.token)
                        $f7.views.main.router.navigate('/prestation/')

                    }
                })
            )
        })
        .catch(function (error) {
            $f7.dialog.alert(ERROR_SERVER)
            console.error('Error in fetch handler:', error);
        });
}

function cloneLoginCache(response, url) {
    let responseToCache = response.clone();
    // Stockage de la réponse en cache
    caches.open('v1').then(function (cache) {
        cache.put(url, responseToCache);
    });
}

function getCacheLogin(url) {
    return caches.open('v1').then(function (cache) {
        // Récupération de la requête depuis le cache
        return cache.match(url).then(function (response) {
            if (response) {
                // Utilisation de la réponse en cache
                return response;
            }
        });
    }).catch(function (error) {
        // Gestion des erreurs
        console.error('Error in fetch handler:', error);
    });
}

function checkInputFormLogin(username, password, $f7) {
    let returnedValue = false

    if (!username) {
        $f7.dialog.alert('Veuillez renseigner votre nom d\'utilisateur!')
        return returnedValue
    } else if (!password) {
        $f7.dialog.alert('Veuillez renseigner votre mot de passe!')
        return returnedValue
    } else {
        returnedValue = true
        return returnedValue
    }
}
