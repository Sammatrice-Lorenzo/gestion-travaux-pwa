import type Framework7 from 'framework7'
import { createSupplierReturnInvoices } from '../../supplierReturnInvoice.ts'
import type SupplierReturnToolbarService from './SupplierReturnToolbarService.ts'

export default class SupplierReturnFileManagement {
  constructor(private readonly _app: Framework7) {}

  public async sendFiles(
    date: Date,
    toolbarService: SupplierReturnToolbarService,
    onRefreshed?: () => void,
  ): Promise<void> {
    await createSupplierReturnInvoices(date, this._app)

    this._app.on('dialogClosed', async () => {
      await toolbarService.refreshInDom(this._app)
      onRefreshed?.()
    })
  }
}
