import type Framework7 from 'framework7'
import { clearCache } from '../../cache'
import toastSuccess from '../../components/toastSuccess'
import { RouteDTO } from '../../dto/RouteDTO'
import { QONTO_SYNC_STARTED } from '../../messages'
import { getUrl } from '../../urlGenerator'
import { ApiMutationService } from '../api/ApiMutationService'
import type ToolbarCalendarProductInvoiceService from '../calendarProducInvoice/ToolbarCalendarProductInvoiceService'

const URL_QONTO_SYNC = '/api/qonto/supplier_invoices/sync'

/**
 * La synchro tourne côté serveur (worker) : on laisse le temps aux premières factures d'arriver avant de recharger.
 */
export const QONTO_SYNC_REFRESH_DELAY_MS = 15000

export default class ProductInvoiceQontoSyncService {
  private _isRunning = false

  constructor(
    private _app: Framework7,
    private _toolbarService: ToolbarCalendarProductInvoiceService,
    private _refreshDelayMs: number = QONTO_SYNC_REFRESH_DELAY_MS,
  ) {}

  public isRunning(): boolean {
    return this._isRunning
  }

  /**
   * @returns true si le serveur a accepté la demande (202)
   */
  public async synchronize(): Promise<boolean> {
    if (this._isRunning) {
      return false
    }

    this._isRunning = true
    const routeDTO = new RouteDTO()
      .setUrlAPI(getUrl(URL_QONTO_SYNC))
      .setMethod('POST')

    const accepted = await new ApiMutationService(this._app).requestAsyncAction(
      routeDTO,
    )
    if (!accepted) {
      this._isRunning = false

      return false
    }

    toastSuccess(this._app, QONTO_SYNC_STARTED)
    window.setTimeout(() => this.refreshInvoices(), this._refreshDelayMs)

    return true
  }

  /**
   * Le bouton est réactivé avant le rafraîchissement, qui redessine la page.
   */
  private async refreshInvoices(): Promise<void> {
    this._isRunning = false

    try {
      await clearCache()
      await this._toolbarService.refreshProductInvoicesInDom(this._app)
    } catch (error) {
      console.error('Rafraîchissement après synchro Qonto impossible', error)
    }
  }
}
