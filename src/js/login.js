import * as messages from './messages'
import * as cache from './cache'

export function login(username, password, $f7) {
    $f7.preloader.show()
    const url = new URL('/api/login', API_URL);

    if (!checkInputFormLogin(username, password, $f7)) return

    // Récupération de la réponse depuis le cache
    getCacheLogin(url)
        .then(async function (response) {
            if (response) {
                // Utilisation de la réponse en cache
                return response.json().then(function (token) {
                    successLogin(token, $f7)
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
            }).then(response => handleLogin(response, $f7, url))
        })
        .catch(function (error) {
            $f7.dialog.alert(messages.ERROR_SERVER)
            $f7.preloader.hide()

            console.error('Error in fetch handler:', error);
        });
}

async function getCacheLogin(url) {
    return caches.open('v1').then(async function (cache) {
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
    }

    returnedValue = true

    return returnedValue

}

function successLogin(token, $f7) {
    localStorage.setItem('token', token.token);
    $f7.preloader.hide()
    $f7.views.main.router.navigate('/prestation/');
}

function handleLogin(response, $f7, url) {
    response.clone().json().then(function (token) {
        if ('code' in token && token.code === 401) {
            $f7.dialog.alert('Vos identifiants sont incorrects!')
            $f7.preloader.hide()
        } else {
            if (process.env.NODE_ENV === 'production') {
                cache.stockResponseInCache(url, response.clone())
            }
            successLogin(token, $f7)
        }
    })
}
