import jwt_decode from 'jwt-decode'

export function getToken() {
    return localStorage.getItem('token')
}

export function getDecodedToken() {
    return jwt_decode(getToken())
}

export function isExpired() {
    const decodedToken = getDecodedToken()

    return Boolean(decodedToken.exp < Date.now() / 1000)
}