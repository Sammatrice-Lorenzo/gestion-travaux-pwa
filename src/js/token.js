import jwt_decode from 'jwt-decode'

const TOKEN = 'token'

export function getToken() {
    return localStorage.getItem(TOKEN)
}

export function getDecodedToken() {
    return jwt_decode(getToken())
}

export function isExpired() {
    const decodedToken = getDecodedToken()

    return Boolean(decodedToken.exp < Date.now() / 1000)
}

export const logout = () => {
    localStorage.removeItem(TOKEN)
}