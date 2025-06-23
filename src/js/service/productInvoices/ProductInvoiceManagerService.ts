import type Framework7 from 'framework7'
import type ProductInvoiceInterface from '../../../intefaces/ProductInvoice/ProductInvoiceInterface'
import { tvaEnum } from '../../enum/tvaEnum'
import { getIdOfElementClicked } from '../../helper/domElementClick'
import { getAmountWithoutTVA } from '../../helper/priceWorkHelper'
import { CONFIRMATION_TO_DELETE } from '../../messages'
import { deleteProductInvoice } from '../../productInvoice'
import productInvoiceStore from '../../store/productInvoiceStore'
import type ToolbarCalendarProductInvoiceService from '../calendarProducInvoice/ToolbarCalendarProductInvoiceService'

export default class ProductInvoiceManagerService {
  private _app: Framework7

  constructor(app: Framework7) {
    this._app = app
  }

  public async handleDeleteProductInvoice(
    element: HTMLElement,
    toolbarService: ToolbarCalendarProductInvoiceService,
  ): Promise<void> {
    const invoiceIdStr = getIdOfElementClicked(this._app.$, element)
    const invoiceId = Number.parseInt(invoiceIdStr)

    this._app.dialog.confirm(CONFIRMATION_TO_DELETE, async () => {
      await deleteProductInvoice(this._app, invoiceId)
      productInvoiceStore.dispatch('removeInvoice', invoiceId)

      await toolbarService.refreshProductInvoicesInDom(this._app)
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
}
