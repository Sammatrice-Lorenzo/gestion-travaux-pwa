import * as messages from './messages'
import * as cache from './cache'

export async function login(username, password, $f7) {
    const preloader = $f7.preloader
    const url = new URL('/api/login', API_URL);

    if (!checkInputFormLogin(username, password, $f7)) return
    preloader.show()

    await cache.checkAndClearCache()
    // Récupération de la réponse depuis le cache
    await getCacheLogin(url)
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
            preloader.hide()

            console.error('Error in fetch handler:', error);
        });
}

async function getCacheLogin(url) {
    return caches.open('v1').then(async function (cache) {
        return cache.match(url).then(async function (response) {
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

/**
 * @param { string } username 
 * @param { string } password 
 * @param {*} $f7 
 * @returns { boolean }
 */
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

/**
 * @param { string } token 
 * @param {*} $f7
 * 
 * @returns { void }
 */
function successLogin(token, $f7) {
    localStorage.setItem('token', token.token);
    $f7.preloader.hide()
    $f7.views.main.router.navigate('/prestation/');
}

/**
 * @param { Response } response 
 * @param {*} $f7 
 * @param { URL } url
 * 
 * @returns { void }
 */
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
