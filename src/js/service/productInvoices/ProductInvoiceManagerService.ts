import type Framework7 from 'framework7'
import type ProductInvoiceInterface from '../../../intefaces/ProductInvoice/ProductInvoiceInterface'
import { tvaEnum } from '../../enum/tvaEnum'
import { getAmountWithoutTVA } from '../../helper/priceWorkHelper'
import { CONFIRMATION_TO_DELETE } from '../../messages'
import {
  deleteProductInvoice,
  getProductsInvoicesByUser,
} from '../../productInvoice'
import productInvoiceStore from '../../store/productInvoiceStore'
import type Pagination from '../Pagination'
import type ToolbarCalendarProductInvoiceService from '../calendarProducInvoice/ToolbarCalendarProductInvoiceService'

export default class ProductInvoiceManagerService {
  private _app: Framework7

  constructor(app: Framework7) {
    this._app = app
  }

  public async handleDeleteProductInvoice(
    productInvoice: ProductInvoiceInterface,
    toolbarService: ToolbarCalendarProductInvoiceService,
  ): Promise<void> {
    this._app.dialog.confirm(CONFIRMATION_TO_DELETE, async () => {
      await deleteProductInvoice(this._app, productInvoice.id)
      productInvoiceStore.dispatch('removeInvoice', productInvoice.id)

      this._app.on('dialogClosed', async () => {
        await toolbarService.refreshProductInvoicesInDom(this._app)
      })
    })
  }

  public totalAmountProductInvoices(): string {
    const productInvoices = productInvoiceStore.getters.getInvoices
      .value as ProductInvoiceInterface[]

    return productInvoices.length >= 1
      ? productInvoices
          .map((invoice) => invoice.totalAmount)
          .reduce((accumulator, current) => accumulator + current)
          .toFixed(2)
      : '0'
  }

  public getTVAOfTotalAmountProductInvoiceFiles(): string {
    const total = Number.parseFloat(this.totalAmountProductInvoices())
    return (total - getAmountWithoutTVA(total, tvaEnum.TVA_PRODUCT)).toFixed(2)
  }

  public handlePagination(pagination: Pagination): void {
    const cards: HTMLElement[] = this._app.$('.invoice-card')

    const start: number =
      (pagination.currentPage - 1) * pagination.totalElementParPage
    const end: number = start + pagination.totalElementParPage
    pagination.totalItems = cards.length
    for (const [index, card] of cards.entries()) {
      if (index >= start && index < end) {
        ;(card as HTMLElement).style.display = 'block'
      } else {
        ;(card as HTMLElement).style.display = 'none'
      }
    }

    const paginationInfo = document.getElementById('pagination-info')
    if (paginationInfo) {
      paginationInfo.innerHTML = `Affichage des factures <strong>${start + 1}</strong> à <strong>${Math.min(end, cards.length)}</strong> sur <strong>${cards.length}</strong>`
    }
  }

  public async initializeProductInvoices(
    pagination: Pagination,
    date: Date,
    toolbarService: ToolbarCalendarProductInvoiceService,
  ): Promise<void> {
    const productInvoicesByUser: ProductInvoiceInterface[] =
      await getProductsInvoicesByUser(this._app, date)
    productInvoiceStore.dispatch('setInvoices', productInvoicesByUser)
    const $ = this._app.$

    pagination.totalItems = productInvoicesByUser.length
    pagination.paginationContainer = document.querySelector(
      '#pagination-links-index-invoices',
    ) as HTMLElement

    pagination.setUpdateContentCallBack(() => {
      this.handlePagination(pagination)
    })
    toolbarService.pagination = pagination
    pagination.updatePagination(
      $('#products-invoice-prev'),
      $('#products-invoice-next'),
    )
  }
}
