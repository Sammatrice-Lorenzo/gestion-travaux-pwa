export const SUCCESS_INSERTION_FORM = "L'insertion a été bien prise en compte!"
export const SUCCESS_UPDATE_FORM = 'La modification a été bien prise en compte!'
export const SUCCESS_DELETE_FORM = 'La suppression a été bien prise en compte!'
export const ERROR_SERVER = "La requête n'as pas pu aboutir"
export const CONFIRMATION_TO_DELETE = 'Vous êtes sûr de vouloir supprimer ?'
export const TOKEN_EXPIRED = 'Le token a expiré veuillez vous reconnecter !'
export const QONTO_SYNC_STARTED =
  "Synchronisation Qonto lancée : les nouvelles factures s'affichent au fur et à mesure."
export const QONTO_SYNC_REFRESH_FAILED =
  "Les factures n'ont pas pu être rechargées : rouvrez la page pour voir les dernières importées."

/**
 * @var { Object<string> }
 */
const messagesByMethod = {
  POST: SUCCESS_INSERTION_FORM,
  PUT: SUCCESS_UPDATE_FORM,
  DELETE: SUCCESS_DELETE_FORM,
}

/**
 * @param { string } method
 * @returns { string }
 */
export function getTypeMessageByMethodAPI(method) {
  return messagesByMethod[method] || ''
}
