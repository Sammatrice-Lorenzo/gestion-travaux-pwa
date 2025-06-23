import type Framework7 from 'framework7'
import type ProductInvoiceInterface from '../../../../intefaces/ProductInvoice/ProductInvoiceInterface'
import toastError from '../../../components/toastError'
import {
  createProductInvoices,
  downloadFileProductInvoice,
  downloadZIP,
} from '../../../productInvoice'
import type ToolbarCalendarProductInvoiceService from '../../calendarProducInvoice/ToolbarCalendarProductInvoiceService'

export default class ProductInvoiceFileManagement {
  private _app: Framework7

  constructor(app: Framework7) {
    this._app = app
  }

  public async sendFiles(
    date: Date,
    toolbarService: ToolbarCalendarProductInvoiceService,
  ): Promise<void> {
    await createProductInvoices(date, this._app)

    this._app.on('dialogClosed', async () => {
      await toolbarService.refreshProductInvoicesInDom(this._app)
    })
  }

  public downloadPDF(productInvoice: ProductInvoiceInterface | null): void {
    if (productInvoice) {
      downloadFileProductInvoice(this._app, productInvoice)
    } else {
      this._app.dialog.alert('Facture introuvable.')
    }
  }

  public downloadSelectedInvoices(
    selectedInvoices: string[],
    date: Date,
  ): void {
    if (selectedInvoices.length < 1) {
      toastError(this._app, 'Veuillez sélectionner au moins une facture!')
      return
    }
    downloadZIP(this._app, selectedInvoices, date)
  }
}
