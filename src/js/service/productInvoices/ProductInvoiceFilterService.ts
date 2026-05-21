import type Framework7 from 'framework7'
import type ProductInvoiceInterface from '../../../intefaces/ProductInvoice/ProductInvoiceInterface'
import productInvoiceStore from '../../store/productInvoiceStore'
import type Pagination from '../Pagination'
import type InvoicePaginatorService from './InvoicePaginatorService'

interface RefreshOptions {
  originalInvoices: ProductInvoiceInterface[]
  searchTerm: string
  selectedSupplier: string
  pagination: Pagination
  invoicePaginatorService: InvoicePaginatorService
}

export default class ProductInvoiceFilterService {
  private _app: Framework7
  private _$update: CallableFunction

  constructor(app: Framework7, $update: CallableFunction) {
    this._app = app
    this._$update = $update
  }

  public getFilteredInvoices(
    originalInvoices: ProductInvoiceInterface[],
    searchTerm: string,
    selectedSupplier: string,
  ): ProductInvoiceInterface[] {
    const invoices: ProductInvoiceInterface[] = originalInvoices.length
      ? originalInvoices
      : productInvoiceStore.getters.getInvoices.value || []
    const normalizedSearchTerm = searchTerm?.trim().toLowerCase() || ''

    return invoices.filter((inv) => {
      const invoiceName = inv.name ? inv.name.toString().toLowerCase() : ''
      const supplierName = inv.supplier?.name
        ? inv.supplier.name.toString().toLowerCase()
        : ''
      const invoiceDate = new Date(inv.date).toLocaleDateString().toLowerCase()

      const matchSearch =
        !normalizedSearchTerm ||
        invoiceName.includes(normalizedSearchTerm) ||
        supplierName.includes(normalizedSearchTerm) ||
        invoiceDate.includes(normalizedSearchTerm)

      const selectedSupplierId = selectedSupplier
        ? Number(selectedSupplier)
        : null

      const matchSupplier =
        !selectedSupplierId || inv.supplier?.id === selectedSupplierId

      return matchSearch && matchSupplier
    })
  }

  public async refreshInvoices({
    originalInvoices,
    searchTerm,
    selectedSupplier,
    pagination,
    invoicePaginatorService,
  }: RefreshOptions): Promise<ProductInvoiceInterface[]> {
    const filteredInvoices = this.getFilteredInvoices(
      originalInvoices,
      searchTerm,
      selectedSupplier,
    )

    productInvoiceStore.dispatch('setFilteredInvoices', filteredInvoices)

    pagination.totalItems = filteredInvoices.length
    pagination.currentPage = 1

    await this._$update()

    const $ = this._app.$
    pagination.updatePagination(
      $('#products-invoice-prev'),
      $('#products-invoice-next'),
    )

    setTimeout(() => {
      const freshCards = Array.from(document.querySelectorAll('.invoice-card'))
      invoicePaginatorService.paginateCards(freshCards, pagination)
    }, 50)

    return filteredInvoices
  }
}
