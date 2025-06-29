import type Framework7 from 'framework7'
import type { Dialog } from 'framework7/components/dialog'
import { clearCache } from '../../cache'
import type { RouteDTO } from '../../dto/RouteDTO'
import { downloadFile } from '../../helper/fileHelper'
import * as messages from '../../messages.js'
import { getToken, logout } from '../../token'
import { getUrlById } from '../../urlGenerator'

export class ApiMutationService {
  private _dialog: Dialog.AppMethods['dialog']
  private _app: Framework7

  constructor($f7: Framework7) {
    this._dialog = $f7.dialog
    this._app = $f7
  }

  private getHeaders(type = 'application/json') {
    const token = getToken()
    return {
      'Content-Type': type,
      Accept: type,
      Authorization: `Bearer ${token}`,
    }
  }

  private handleErrorResponse(statusCode: number): void {
    if (statusCode === 401) {
      this._dialog.alert(messages.TOKEN_EXPIRED, '', async () => {
        await logout(this._app)
      })
    } else {
      this._dialog.alert(messages.ERROR_SERVER)
    }
  }

  private async handleResponse(
    response: Response,
    successMessage: string,
    route: string,
  ): Promise<void> {
    const status = response.status

    const isRequestExectuedWith =
      status === 200 || status === 201 || status === 204
    if (isRequestExectuedWith) {
      await clearCache()
      this._dialog.alert(successMessage)
      this._app.views.main.router.navigate(route)
    } else if (status === 422) {
      const data = await response.json()
      this._dialog.alert(data['hydra:description'] || messages.ERROR_SERVER)
    } else {
      this.handleErrorResponse(status)
    }
  }

  public async post(routeDTO: RouteDTO, isFormData = false): Promise<void> {
    const headers = isFormData
      ? { Authorization: `Bearer ${getToken()}` }
      : this.getHeaders()

    try {
      const response = await fetch(routeDTO.getUrlAPI(), {
        method: 'POST',
        headers,
        body: routeDTO.getBody(),
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

  public async generic(routeDTO: RouteDTO): Promise<void> {
    const method = routeDTO.getMethod()
    const message = messages.getTypeMessageByMethodAPI(method)

    try {
      const response = await fetch(routeDTO.getUrlAPI(), {
        method,
        headers: this.getHeaders(),
        body: routeDTO.getBody(),
      })

      await this.handleResponse(response, message, routeDTO.getRoute())
    } catch (error) {
      console.error(error)
      this._dialog.alert(messages.ERROR_SERVER)
    }
  }

  public async delete(routeDTO: RouteDTO): Promise<void> {
    const url = getUrlById(routeDTO.getUrlAPI(), routeDTO.getIdElement())

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      await this.handleResponse(
        response,
        messages.SUCCESS_DELETE_FORM,
        routeDTO.getRoute(),
      )
    } catch (error) {
      console.error(error)
      this._dialog.alert(messages.ERROR_SERVER)
    }
  }

  public async download(routeDTO: RouteDTO, fileName: string): Promise<void> {
    try {
      const response = await fetch(routeDTO.getUrlAPI(), {
        method: routeDTO.getMethod(),
        headers: this.getHeaders(),
        body: routeDTO.getBody(),
      })

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
