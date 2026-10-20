import type Framework7 from 'framework7'
import { clearCache } from '../../cache'
import toastError from '../../components/toastError'
import toastSuccess from '../../components/toastSuccess'
import { RouteDTO } from '../../dto/RouteDTO'
import { QONTO_SYNC_REFRESH_FAILED, QONTO_SYNC_STARTED } from '../../messages'
import productInvoiceStore from '../../store/productInvoiceStore'
import { getUrl } from '../../urlGenerator'
import { ApiMutationService } from '../api/ApiMutationService'

const URL_QONTO_SYNC = '/api/qonto/supplier_invoices/sync'

/**
 * La synchro tourne côté serveur (worker) sans signal de fin : la page recharge les factures à intervalle régulier,
 * le temps qu'elle aboutit en pratique, pour les afficher au fur et à mesure (la notification push prévient aussi).
 */
export const QONTO_SYNC_POLL_INTERVAL_MS = 10000
export const QONTO_SYNC_MAX_DURATION_MS = 120000

type RefreshCallback = () => Promise<void>

export default class ProductInvoiceQontoSyncService {
  private _timerId: number | null = null
  private _isDisposed = false

  /**
   * @param _refresh recharge factures et fournisseurs de la page, puis la redessine (même en cas d'erreur)
   */
  constructor(
    private _app: Framework7,
    private _refresh: RefreshCallback,
    private _pollIntervalMs: number = QONTO_SYNC_POLL_INTERVAL_MS,
    private _maxDurationMs: number = QONTO_SYNC_MAX_DURATION_MS,
  ) {}

  /**
   * L'état vit dans le store : quitter puis rouvrir la page pendant la synchro ne permet pas d'en lancer une seconde.
   */
  public isRunning(): boolean {
    const startedAt = productInvoiceStore.getters.getQontoSyncStartedAt.value as
      | number
      | null

    return startedAt !== null && Date.now() - startedAt < this._maxDurationMs
  }

  /**
   * @returns true si le serveur a accepté la demande (202)
   */
  public async synchronize(): Promise<boolean> {
    if (this.isRunning()) {
      return false
    }

    productInvoiceStore.dispatch('startQontoSync', Date.now())
    const routeDTO = new RouteDTO()
      .setUrlAPI(getUrl(URL_QONTO_SYNC))
      .setMethod('POST')

    const accepted = await new ApiMutationService(this._app).requestAsyncAction(
      routeDTO,
    )
    if (!accepted) {
      productInvoiceStore.dispatch('endQontoSync')

      return false
    }

    toastSuccess(this._app, QONTO_SYNC_STARTED)
    this.schedulePoll()

    return true
  }

  /**
   * Reprend le suivi d'une synchro lancée avant d'ouvrir cette page (aller-retour pendant la synchro).
   */
  public resume(): void {
    if (this.isRunning()) {
      this.schedulePoll()
    }
  }

  /**
   * À appeler quand la page est retirée : plus aucun rafraîchissement ne vise son DOM ni son store.
   */
  public dispose(): void {
    this._isDisposed = true
    this.clearTimer()
  }

  private schedulePoll(): void {
    this.clearTimer()
    if (this._isDisposed) {
      return
    }

    this._timerId = window.setTimeout(() => this.poll(), this._pollIntervalMs)
  }

  private clearTimer(): void {
    if (this._timerId !== null) {
      window.clearTimeout(this._timerId)
      this._timerId = null
    }
  }

  private isLastPoll(): boolean {
    const startedAt = productInvoiceStore.getters.getQontoSyncStartedAt.value as
      | number
      | null
    if (startedAt === null) {
      return true
    }

    return Date.now() - startedAt + this._pollIntervalMs >= this._maxDurationMs
  }

  /**
   * Au dernier passage, la synchro est déclarée terminée avant le rechargement : la page redessinée réactive le bouton.
   */
  private async poll(): Promise<void> {
    this._timerId = null
    if (this._isDisposed) {
      return
    }

    const isLastPoll = this.isLastPoll()
    if (isLastPoll) {
      productInvoiceStore.dispatch('endQontoSync')
    }

    try {
      await clearCache()
      await this._refresh()
    } catch (error) {
      console.error('Rafraîchissement après synchro Qonto impossible', error)
      if (isLastPoll && !this._isDisposed) {
        toastError(this._app, QONTO_SYNC_REFRESH_FAILED)
      }
    }

    if (!isLastPoll) {
      this.schedulePoll()
    }
  }
}
