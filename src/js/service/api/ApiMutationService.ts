import type Framework7 from 'framework7'
import type { Dialog } from 'framework7/components/dialog'
import { clearCache } from '../../cache'
import toastError from '../../components/toastError'
import type { RouteDTO } from '../../dto/RouteDTO'
import { downloadFile } from '../../helper/fileHelper'
import * as messages from '../../messages'
import { getUrlById } from '../../urlGenerator'
import { apiCredentials, clearSession, logout } from '../SessionService'

interface SendOptions {
  method?: string
  url?: string | URL
  headers?: HeadersInit
  body?: BodyInit | null
}

const HTTP_ACCEPTED = 202

export class ApiMutationService {
  private _dialog: Dialog.AppMethods['dialog']
  private _app: Framework7

  constructor($f7: Framework7) {
    this._dialog = $f7.dialog
    this._app = $f7
  }

  private getHeaders(type = 'application/json') {
    return {
      'Content-Type': type,
      Accept: type,
    }
  }

  private send(
    routeDTO: RouteDTO,
    options: SendOptions = {},
  ): Promise<Response> {
    return fetch(options.url ?? routeDTO.getUrlAPI(), {
      method: options.method ?? routeDTO.getMethod(),
      credentials: apiCredentials,
      headers: options.headers ?? this.getHeaders(),
      body: options.body === undefined ? routeDTO.getBody() : options.body,
    })
  }

  /**
   * Raison renvoyée par l'API : format API Platform (hydra:description, detail) ou contrôleur Symfony (message).
   */
  private async getErrorMessage(response: Response): Promise<string> {
    const data = await response.json().catch(() => null)

    return (
      data?.['hydra:description'] ||
      data?.detail ||
      data?.message ||
      messages.ERROR_SERVER
    )
  }

  /**
   * 401 : session expirée, déconnexion. Autre 4xx : la raison donnée par l'API. 5xx : message générique.
   */
  private async handleErrorResponse(response: Response): Promise<void> {
    const status = response.status

    if (status === 401) {
      clearSession()
      this._dialog.alert(messages.TOKEN_EXPIRED, '', async () => {
        await logout(this._app)
      })
      return
    }

    const isClientError = status >= 400 && status < 500
    toastError(
      this._app,
      isClientError
        ? await this.getErrorMessage(response)
        : messages.ERROR_SERVER,
    )
  }

  private async handleResponse(
    response: Response,
    successMessage: string,
    route: string,
    skipNavigation = false,
  ): Promise<unknown> {
    const status = response.status

    const isRequestExectuedWith =
      status === 200 || status === 201 || status === 204
    if (isRequestExectuedWith) {
      await clearCache()
      this._dialog.alert(successMessage)
      if (!skipNavigation) {
        this._app.views.main.router.navigate(route)
      }

      const contentType = response.headers.get('content-type') ?? ''
      if (contentType.includes('json') && status !== 204) {
        return response.json()
      }

      return null
    }

    await this.handleErrorResponse(response)
  }

  public async post(routeDTO: RouteDTO, isFormData = false): Promise<void> {
    try {
      const response = await this.send(routeDTO, {
        method: 'POST',
        headers: isFormData ? {} : this.getHeaders(),
      })

      await this.handleResponse(
        response,
        messages.SUCCESS_INSERTION_FORM,
        routeDTO.getRoute(),
      )
    } catch (error) {
      console.error(error)
      this._dialog.alert(messages.ERROR_SERVER)
    }
  }

  public async generic(routeDTO: RouteDTO): Promise<unknown> {
    const message = messages.getTypeMessageByMethodAPI(routeDTO.getMethod())

    try {
      const response = await this.send(routeDTO)

      return await this.handleResponse(
        response,
        message,
        routeDTO.getRoute(),
        routeDTO.getSkipNavigation(),
      )
    } catch (error) {
      console.error(error)
      this._dialog.alert(messages.ERROR_SERVER)
      return null
    }
  }

  public async delete(routeDTO: RouteDTO): Promise<void> {
    try {
      const response = await this.send(routeDTO, {
        method: 'DELETE',
        url: getUrlById(routeDTO.getUrlAPI(), routeDTO.getIdElement()),
        headers: this.getHeaders('application/ld+json'),
        body: null,
      })

      await this.handleResponse(
        response,
        messages.SUCCESS_DELETE_FORM,
        routeDTO.getRoute(),
        routeDTO.getSkipNavigation(),
      )
    } catch (error) {
      console.error(error)
      this._dialog.alert(messages.ERROR_SERVER)
    }
  }

  /**
   * Action traitée en différé par le serveur : seule une réponse 202 vaut acceptation. Ni dialogue ni navigation,
   * l'appelant affiche sa confirmation ; un refus affiche la raison donnée par l'API.
   *
   * @returns true si la demande a été acceptée (202)
   */
  public async requestAsyncAction(routeDTO: RouteDTO): Promise<boolean> {
    try {
      const response = await this.send(routeDTO)
      if (response.status === HTTP_ACCEPTED) {
        return true
      }

      if (response.ok) {
        console.error(
          `Réponse ${response.status} inattendue : 202 attendu pour une action différée.`,
        )
        toastError(this._app, messages.ERROR_SERVER)
        return false
      }

      await this.handleErrorResponse(response)
      return false
    } catch (error) {
      console.error(error)
      toastError(this._app, messages.ERROR_SERVER)
      return false
    }
  }

  public async fetchJson<T>(routeDTO: RouteDTO): Promise<T[]> {
    try {
      const response = await this.send(routeDTO)
      if (response.status === 200) {
        return response.json()
      }

      await this.handleErrorResponse(response)
      return []
    } catch (error) {
      console.error(error)
      toastError(this._app, messages.ERROR_SERVER)
      return []
    }
  }

  public async download(routeDTO: RouteDTO, fileName: string): Promise<void> {
    try {
      const response = await this.send(routeDTO)

      if (response.status === 200) {
        const blob = await response.blob()
        await downloadFile(blob, fileName)
      } else {
        this._dialog.alert(
          response.status === 401
            ? messages.TOKEN_EXPIRED
            : messages.ERROR_SERVER,
        )
      }
    } catch (error) {
      console.error(error)
      await clearCache()
      this._dialog.alert(messages.ERROR_SERVER)
    }
  }
}
