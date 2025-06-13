import type Framework7 from 'framework7'
import type { Dialog } from 'framework7/components/dialog'
import type { Preloader } from 'framework7/components/preloader'
import type { View } from 'framework7/types'
import { stockResponseInCache } from '../../cache'
import * as messages from '../../messages'
import { getToken } from '../../token'

type ApiResponse<T> = T[]

type ApiRawResponse<T> = {
  code?: number
  'hydra:member'?: T[] | T
  'hydra:totalItems'?: number
} & Record<string, unknown>

export class ApiService {
  private _preloader: Preloader.AppMethods['preloader']
  private _dialog: Dialog.AppMethods['dialog']
  private _router: View.View['router']
  private _totalItems: number

  constructor($f7: Framework7) {
    this._preloader = $f7.preloader
    this._dialog = $f7.dialog
    this._router = $f7.views.main.router
    this._totalItems = 0
  }

  private getHeaders(header?: string) {
    const token = getToken()
    const type: string = header ?? 'application/json'

    return {
      'Content-Type': type,
      Authorization: `Bearer ${token}`,
      Accept: type,
    }
  }

  private handleCache(url: string, response: Response): void {
    if (process.env.NODE_ENV === 'production') {
      stockResponseInCache(url, response.clone())
    }
  }

  private async redirectWhenUnathorized(
    data: ApiRawResponse<unknown>,
  ): Promise<boolean> {
    if (data.code === 401) {
      this._dialog.alert(messages.TOKEN_EXPIRED)
      this._router.navigate('/')

      return true
    }

    return false
  }

  public extractDataResponse<T>(data: ApiRawResponse<T>): ApiResponse<T> {
    let items: T[]

    if ('hydra:member' in data) {
      this._totalItems = data['hydra:totalItems'] as number
      items = Array.isArray(data['hydra:member'])
        ? data['hydra:member']
        : [data['hydra:member']]
    } else {
      items = Array.isArray(data) ? data : [data]
    }

    return items
  }

  async call<T = unknown>(
    url: URL | string,
    header?: string,
  ): Promise<ApiResponse<T>> {
    this._preloader.show()

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(header),
      })

      const data = await response.clone().json()
      this.handleCache(url, response)

      const isUnauthorized = await this.redirectWhenUnathorized(data)
      if (isUnauthorized) return []

      return this.extractDataResponse(data)
    } catch (error) {
      console.error('API Error:', error)
      return []
    } finally {
      this._preloader.hide()
    }
  }

  public getTotalItems(): number {
    return this._totalItems
  }
}
