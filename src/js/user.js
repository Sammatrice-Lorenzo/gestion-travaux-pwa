import  { getUrlUser } from './urlGenerator.js'
import  { getToken } from './token.js'

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
            $f7.dialog.alert(ERROR_SERVER)
        })

    return user
}
