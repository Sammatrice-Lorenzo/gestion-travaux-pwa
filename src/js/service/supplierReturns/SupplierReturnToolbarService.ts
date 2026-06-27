import type Framework7 from 'framework7'
import type { Calendar } from 'framework7/components/calendar'
import type SupplierReturnInvoiceInterface from '../../../intefaces/SupplierReturn/SupplierReturnInvoiceInterface'
import { monthsEnum } from '../../enum/monthEnum'
import supplierReturnInvoiceStore from '../../store/supplierReturnInvoiceStore'
import { getSupplierReturnInvoicesByUser } from '../../supplierReturnInvoice.ts'
import type Pagination from '../Pagination'
import type InvoicePaginatorService from '../productInvoices/InvoicePaginatorService'

export default class SupplierReturnToolbarService {
  private _date: Date
  private _$update: CallableFunction
  private _inputSelector: string

  public pagination!: Pagination
  public invoicePaginatorService!: InvoicePaginatorService

  constructor(
    $update: CallableFunction,
    inputSelector = '#calendar-input-supplier-return',
  ) {
    this._date = new Date()
    this._$update = $update
    this._inputSelector = inputSelector
  }

  public async updateToolbar(
    app: Framework7,
    calendar: Calendar.Calendar,
  ): Promise<void> {
    const monthNames = monthsEnum.getMonths()
    const currentMonth = monthNames[calendar.currentMonth]
    const currentYear = calendar.currentYear
    const $ = app.$

    if (currentMonth !== undefined) {
      const selectorCalendar = $(this._inputSelector)[0]
      $(selectorCalendar).val(`${currentMonth} ${currentYear}`)
      $(selectorCalendar).attr('month', currentMonth)
      $(selectorCalendar).attr('year', currentYear)
      this._date = new Date(currentYear, calendar.currentMonth, 15)
      await this.refreshInDom(app)
    }
  }

  public getDate(): Date {
    return this._date
  }

  public async refreshInDom(app: Framework7): Promise<void> {
    const $ = app.$
    const invoices: SupplierReturnInvoiceInterface[] =
      await getSupplierReturnInvoicesByUser(app, this._date)

    supplierReturnInvoiceStore.dispatch('setInvoices', invoices)
    await this._$update()

    const displayed =
      supplierReturnInvoiceStore.getters.getFilteredInvoices.value
    this.pagination.totalItems = displayed.length
    this.pagination.updatePagination(
      $('#supplier-return-prev'),
      $('#supplier-return-next'),
    )

    await new Promise((resolve) => requestAnimationFrame(resolve))
    const cards: HTMLElement[] = $('.return-invoice-card')
    this.invoicePaginatorService.paginateCards(cards, this.pagination)
  }
}
