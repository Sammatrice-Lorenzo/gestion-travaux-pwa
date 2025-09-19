import type Framework7 from 'framework7'
import type { Calendar } from 'framework7/components/calendar'
import type ProductInvoiceInterface from '../../../intefaces/ProductInvoice/ProductInvoiceInterface.js'
import { monthsEnum } from '../../enum/monthEnum.js'
import { getProductsInvoicesByUser } from '../../productInvoice.js'
import productInvoiceStore from '../../store/productInvoiceStore.js'
import type Pagination from '../Pagination.ts'
import type InvoicePaginatorService from '../productInvoices/InvoicePaginatorService'

export default class ToolbarCalendarProductInvoiceService {
  private _date: Date
  private _$update: CallableFunction

  public pagination!: Pagination
  public invoicePaginatorService!: InvoicePaginatorService

  constructor($update: CallableFunction) {
    this._date = new Date()
    this._$update = $update
  }

  public async updateToolbar(
    app: Framework7,
    calendar: Calendar.Calendar,
  ): Promise<void> {
    const monthNames = monthsEnum.getMonths()
    const currentMonth = monthNames[calendar.currentMonth]
    const currentYear: number = calendar.currentYear

    const $ = app.$

    if (currentMonth !== undefined) {
      const selectorCalendar = $('#calendar-input-product-invoice-file')[0]

      $(selectorCalendar).val(`${currentMonth} ${currentYear}`)
      $(selectorCalendar).attr('month', currentMonth)
      $(selectorCalendar).attr('year', currentYear)
      this._date = new Date(currentYear, calendar.currentMonth, 15)
      await this.refreshProductInvoicesInDom(app)
    } else {
      $(calendar)
        .find('.calendar-custom-toolbar')
        .val(`${currentMonth} ${currentYear}`)
    }
  }

  public getDate(): Date {
    return this._date
  }

  public async refreshProductInvoicesInDom(app: Framework7): Promise<void> {
    const $ = app.$

    const productInvoices: ProductInvoiceInterface[] =
      await getProductsInvoicesByUser(app, this._date)

    productInvoiceStore.dispatch('setInvoices', productInvoices)
    await this._$update()

    this.pagination.totalItems = productInvoices.length
    this.pagination.updatePagination(
      $('#products-invoice-prev'),
      $('#products-invoice-next'),
    )

    await new Promise((resolve) => requestAnimationFrame(resolve))

    const cards: HTMLElement[] = $('.invoice-card')
    this.invoicePaginatorService.paginateCards(cards, this.pagination)
  }
}
