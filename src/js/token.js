import jwt_decode from 'jwt-decode'
import { clearCache } from './cache'

const TOKEN = 'token'

export function getToken() {
    return localStorage.getItem(TOKEN) ?? null
}

export function getDecodedToken() {
    return jwt_decode(getToken())
}

export function isExpired() {
    const decodedToken = getDecodedToken()

    return Boolean(decodedToken.exp < Date.now() / 1000)
}

export async function logout ($f7) {
    $f7.views.main.router.navigate('/', {
        clearPreviousHistory: true,
        animate: false
    })

    localStorage.removeItem(TOKEN)
    if (process.env.NODE_ENV === 'production') {
        await clearCache()
    }
}