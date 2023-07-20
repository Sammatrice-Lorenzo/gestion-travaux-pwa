export const SUCCESS_INSERTION_FORM = 'L\'insertion a été bien prise en compte!'
export const SUCCESS_UPDATE_FORM = 'La modification a été bien prise en compte!'
export const SUCCESS_DELETE_FORM = 'La suppression a été bien prise en compte!'
export const ERROR_SERVER = 'La requête n\'as pa pu aboutir'
export const CONFIRMATION_TO_DELETE = 'Vous êtes sûr de vouloir supprimer ?'

/**
 * @param { string } method 
 * @returns { string }
 */
export function getTypeMessageByMethodAPI(method)
{
    let message = ''

    switch (method) {
        case 'POST':
            message = SUCCESS_INSERTION_FORM
            break
        case 'PUT':
            message = SUCCESS_UPDATE_FORM
            break
        case 'DELETE':
            message = SUCCESS_DELETE_FORM
            break
        default:
            break
    }

    return message
}