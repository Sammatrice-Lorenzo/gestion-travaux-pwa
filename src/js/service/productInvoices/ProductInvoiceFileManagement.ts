import type Framework7 from 'framework7'
import { createProductInvoices } from '../../productInvoice'
import type ToolbarCalendarProductInvoiceService from '../calendarProducInvoice/ToolbarCalendarProductInvoiceService'

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
}
