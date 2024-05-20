import * as messages from './messages'
import { getUrlById, getUrl, getUrlUser } from './urlGenerator.js'
import { getToken } from './token.js'
import { clearCache } from './cache'

export async function showUser()
{
    const token = getToken()
    const url = getUrlUser()
    let user = {}

    await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response =>
        response
            .json()
            .then(function (data) {
                user = {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                }

                return user
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(messages.ERROR_SERVER)
        })

    return user
}

export function createUser(form, $f7)
{
    const url = getUrl('/api/register')
    const body = getBodyUser(form, true)
    if (!customValidation(form, $f7)) {
        return
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body
    }).then(response =>
        response
            .json()
            .then(function (data) {
                if (data.code === '422') {
                    $f7.dialog.alert('Cette email existe déjà au sein de l\'application veuillez ressayer avec une autre')
                } else {
                    $f7.dialog.alert(messages.SUCCESS_INSERTION_FORM)
                    $f7.dialog.alert('Un email de confirmation vous a été envoyée veuillez confirmer votre email avant de vous connecté')
                }
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(messages.ERROR_SERVER)
        })

    $f7.views.main.router.navigate('/', {
        clearPreviousHistory: true,
        animate: false
    })
}

export function updateUser(form, idUser, $f7)
{
    const token = getToken()
    const url = getUrlById('/api/user/edit/', idUser)
    const message = messages.getTypeMessageByMethodAPI('PUT')

    const body = getBodyUser(form, false)
    if (!customValidation(form, $f7)) {
        return
    }

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: body
    }).then(response =>
        response
            .json()
            .then(function (data) {
                clearCache()
                localStorage.removeItem('token')
                localStorage.setItem('token', data.token)

                $f7.dialog.alert(message)
                $f7.views.main.router.navigate('/mon-compte/')
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(messages.ERROR_SERVER)
        })

}

function customValidation(form, $f7)
{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let valueReturned = false

    if (form.lastname === '') {
        $f7.dialog.alert('Veuillez saisir un nom')
        return valueReturned
    } else if (form.firstname === '') {
        $f7.dialog.alert('Veuillez saisir un prénom')
        return valueReturned
    } else if (form.email === '') {
        $f7.dialog.alert('Veuillez saisir un email')
        return valueReturned
    }

    if (form.password !== form.confirmPassword) {
        $f7.dialog.alert('Les deux mots passe ne correspond pas')
    }

    if (!emailRegex.test(form.email)) {
        $f7.dialog.alert('Veuillez saisir un email valide')
        return valueReturned
    }

    return true
}

/**
 * 
 * @param {*} form 
 * @param { boolean } isCreation 
 * @returns 
 */
function getBodyUser(form, isCreation)
{
    if (isCreation) {
        return JSON.stringify({
            firstname: form.firstname,
            lastname: form.lastname,
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
        })
    }

    return JSON.stringify({
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email
    })
}
