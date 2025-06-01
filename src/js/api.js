import { clearCache } from './cache'
import { RouteDTO } from './dto/RouteDTO'
import { downloadFile } from './helper/fileHelper'
import * as messages from './messages'
import { getToken } from './token'
import { getUrlById } from './urlGenerator'

const getHeaders = () => {
  const token = getToken()

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

/**
 * @param { RouteDTO } routeDTO
 *
 * @returns { void }
 */
function apiRequest(routeDTO) {
  const $f7 = routeDTO.getApp()
  const method = routeDTO.getMethod()
  const message = messages.getTypeMessageByMethodAPI(method)

  fetch(routeDTO.getUrlAPI(), {
    method: method,
    headers: getHeaders(),
    body: routeDTO.getBody(),
  })
    .then((response) =>
      response.json().then(async () => {
        const statusCode = response.status
        if (statusCode === 200 || statusCode === 201) {
          await clearCache()
          $f7.dialog.alert(message)
          $f7.views.main.router.navigate(routeDTO.getRoute())
        } else {
          $f7.dialog.alert(messages.ERROR_SERVER)
        }
      }),
    )
    .catch((error) => {
      console.log(error)
      $f7.dialog.alert(messages.ERROR_SERVER)
    })
}

/**
 * @param { RouteDTO } routeDTO
 */
function fetchCreate(routeDTO, type = null) {
  const $f7 = routeDTO.getApp()

  let headers = getHeaders()
  if (type === 'formData') {
    headers = {
      Authorization: headers.Authorization,
    }
  }

  fetch(routeDTO.getUrlAPI(), {
    method: 'POST',
    headers: headers,
    body: routeDTO.getBody(),
  })
    .then((response) =>
      response.json().then(async (data) => {
        const status = response.status
        if (response.status === 422) {
          $f7.dialog.alert(data['hydra:description'])
        } else if (status === 200 || status === 201) {
          await clearCache()
          $f7.dialog.alert(messages.SUCCESS_INSERTION_FORM)
          $f7.views.main.router.navigate(routeDTO.getRoute())
        } else {
          $f7.dialog.alert(messages.ERROR_SERVER)
        }
      }),
    )
    .catch((error) => {
      console.log(error)
      $f7.dialog.alert(messages.ERROR_SERVER)
    })
}

/**
 * @param { RouteDTO } routeDTO
 */
function deleteAPI(routeDTO) {
  const url = getUrlById(routeDTO.getUrlAPI(), routeDTO.getIdElement())
  const $f7 = routeDTO.getApp()

  fetch(url, {
    method: 'DELETE',
    headers: getHeaders(),
  })
    .then(async (response) => {
      await clearCache()
      if (response.status === 204) {
        $f7.dialog.alert(messages.SUCCESS_DELETE_FORM)
        $f7.views.main.router.navigate(routeDTO.getRoute())
      } else {
        $f7.dialog.alert(messages.ERROR_SERVER)
      }
    })
    .catch((error) => {
      $f7.dialog.alert(messages.ERROR_SERVER)
    })
}

/**
 * @param { RouteDTO } routeDTO
 * @param { String } nameFile
 */
function fetchFileAPI(routeDTO, nameFile) {
  const $f7 = routeDTO.getApp()

  fetch(routeDTO.getUrlAPI(), {
    method: routeDTO.getMethod(),
    headers: getHeaders(),
    body: routeDTO.getBody(),
  })
    .then((response) => {
      if (response.status === 200) {
        response.blob().then(async (data) => {
          await downloadFile(data, nameFile)
        })
      } else {
        $f7.dialog.alert(
          response.status === 401
            ? messages.TOKEN_EXPIRED
            : messages.ERROR_SERVER,
        )
      }
    })
    .catch(async (error) => {
      console.log(error)
      await clearCache()
      $f7.dialog.alert(messages.ERROR_SERVER)
    })
}

export { apiRequest, deleteAPI, fetchFileAPI, fetchCreate }
