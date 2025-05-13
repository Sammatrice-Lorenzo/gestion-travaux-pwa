import * as messages from './messages'
import { getUrlById, getUrl, getUrlUser } from './urlGenerator.js'
import { getToken } from './token.js'
import { clearCache } from './cache'
import Dom7 from 'dom7'
import { callAPI } from './api.js'

export async function showUser($f7)
{
    const url = getUrlUser()

    const response = await callAPI(url, $f7)

    return response[0]
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
                if (data.code === 422) {
                    $f7.dialog.alert('Cette email existe déjà au sein de l\'application veuillez ressayer avec une autre')
                } else {
                    $f7.dialog.alert(messages.SUCCESS_INSERTION_FORM)
                    $f7.dialog.alert('Un email de confirmation vous a été envoyée veuillez confirmer votre email avant de vous connecté')

                    $f7.views.main.router.navigate('/', {
                        clearPreviousHistory: true,
                        animate: false
                    })
                }
            })
    )
        .catch(error => {
            console.log(error)
            $f7.dialog.alert(messages.ERROR_SERVER)
        })
}

export function updateUser(form, idUser, $f7)
{
    const token = getToken()
    const url = getUrlById('/api/users', idUser)
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
            .then((data) => {
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
    let isFormValid = true

    const $$ = Dom7
    const formSelector = $$('form#form-user')
    const inputs = $$(formSelector).find('input')

    for (const input of inputs) {
        const divParent = $$(input).closest('.item-inner')
        if (input.value.trim() === '') {
            isFormValid = false
            const label = $$(divParent).find('.item-title').text()
            $f7.dialog.alert(`${label} ne peut pas être vide.`)
            $$(divParent).addClass('input-error')
        } else {
            $$(divParent).removeClass('input-error')
        }
    }

    if (form.password !== form.confirmPassword) {
        isFormValid = false
        $f7.dialog.alert('Les deux mots passe ne correspond pas')
        return isFormValid
    }
    
    if (!emailRegex.test(form.email)) {
        isFormValid = false
        $f7.dialog.alert('Veuillez saisir un email valide')

        return isFormValid
    }

    return isFormValid
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
