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
import type InvoicePaginatorService from './InvoicePaginatorService'

export default class ProductInvoiceManagerService {
  private _app: Framework7
  private _toolbarService: ToolbarCalendarProductInvoiceService

  constructor(
    app: Framework7,
    toolbarService: ToolbarCalendarProductInvoiceService,
  ) {
    this._app = app
    this._toolbarService = toolbarService
  }

  public async handleDeleteProductInvoice(
    productInvoice: ProductInvoiceInterface,
  ): Promise<void> {
    this._app.dialog.confirm(CONFIRMATION_TO_DELETE, async () => {
      await deleteProductInvoice(this._app, productInvoice.id)
      productInvoiceStore.dispatch('removeInvoice', productInvoice.id)

      this._app.on('dialogClosed', async () => {
        await this._toolbarService.refreshProductInvoicesInDom(this._app)
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

  public async initializeProductInvoices(
    pagination: Pagination,
    date: Date,
    invoicePaginatorService: InvoicePaginatorService,
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
      const cards: HTMLElement[] = this._app.$('.invoice-card')
      invoicePaginatorService.paginateCards(cards, pagination)
    })

    this._toolbarService.pagination = pagination
    pagination.updatePagination(
      $('#products-invoice-prev'),
      $('#products-invoice-next'),
    )
  }
}
