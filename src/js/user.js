import * as messages from './messages'
import { getUrlUser, getUrlById } from './urlGenerator.js'
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

export function updateUser(form, idUser, $f7)
{
    const token = getToken()
    const url = getUrlById('/api/user/edit/', idUser)
    const message = messages.getTypeMessageByMethodAPI('PUT')

    const body = JSON.stringify({
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email
    })

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
    
    if (!emailRegex.test(form.email)) {
        $f7.dialog.alert('Veuillez saisir un email valide')
        return valueReturned
    }

    return true
}
