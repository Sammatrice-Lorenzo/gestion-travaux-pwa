import type Framework7 from 'framework7'
import type ProductInvoiceInterface from '../../../intefaces/ProductInvoice/ProductInvoiceInterface'
import productInvoiceStore from '../../store/productInvoiceStore'

export default class DataTableProductInvoiceService {
  private _selectedInvoices: number[] = []

  private _app: Framework7

  constructor(app: Framework7) {
    this._app = app
  }

  public toggleInvoiceSelection(invoice: ProductInvoiceInterface): void {
    this._selectedInvoices = this.getInvoiceSelected(invoice)
    const $ = this._app.$
    const allSelected =
      this._selectedInvoices.length ===
      productInvoiceStore.getters.getInvoices.value.length
    $('.data-table thead input[type="checkbox"]').prop('checked', allSelected)
  }

  public selectAllInvoices(event: Event) {
    this._selectedInvoices = this.getAllInvoicesSelected(event)
  }

  public getSelectedProductInvoices(): number[] {
    return this._selectedInvoices
  }

  private getAllInvoicesSelected(event: Event): number[] {
    const $ = this._app.$
    const productInvoices = productInvoiceStore.getters.getInvoices.value
    const isChecked: boolean = $(event.target).is(':checked')
    const selectedInvoicesIds: number[] = isChecked
      ? productInvoices.map((invoice) => invoice.id)
      : []

    $('.data-table tbody input[type="checkbox"]').prop('checked', isChecked)

    return selectedInvoicesIds
  }

  private getInvoiceSelected(invoice: ProductInvoiceInterface): number[] {
    let selectedInvoicesFiltered: number[] = []
    if (this._selectedInvoices.includes(invoice.id)) {
      selectedInvoicesFiltered = this._selectedInvoices.filter(
        (id) => id !== invoice.id,
      )
    } else {
      selectedInvoicesFiltered.push(invoice.id)
    }

    return selectedInvoicesFiltered
  }
}
